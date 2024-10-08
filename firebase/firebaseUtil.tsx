// firebaseUtil.tsx
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import { app, db, storage } from "./firebaseConfig";

import { doc, getDoc } from "firebase/firestore";

// Function to add a new product
export const addProduct = async (
  productName: string,
  productDetails: string,
  productImage: File | null
) => {
  try {
    console.log("add product called");
    // Step 1: Generate the next productCategoryId
    const productCategoryRef = collection(db, "productCategory");
    const productQuery = query(
      productCategoryRef,
      orderBy("productCategoryId", "desc")
    );
    const productSnapshot = await getDocs(productQuery);

    let newProductCategoryId = "001"; // Default for the first product

    if (!productSnapshot.empty) {
      const lastProduct = productSnapshot.docs[0].data();
      const lastProductCategoryId = parseInt(lastProduct.productCategoryId);
      newProductCategoryId = (lastProductCategoryId + 1)
        .toString()
        .padStart(3, "0");
    }

    // Step 2: Upload image to Firebase Storage
    let imageUrl = "";
    if (productImage) {
      const storageRef = ref(
        storage,
        `products/${uuidv4()}-${productImage.name}`
      );
      const snapshot = await uploadBytes(storageRef, productImage);
      imageUrl = await getDownloadURL(snapshot.ref); // Get the uploaded image's URL
    }

    // Step 3: Add product details to Firestore
    const product = await addDoc(productCategoryRef, {
      productCategoryId: newProductCategoryId,
      productName,
      productDetails,
      productImage: imageUrl,
    });
    console.log(product);

    return { success: true, message: "Product added successfully" };
  } catch (error) {
    console.error("Error adding product: ", error);
    if (error instanceof Error) {
      return { success: false, message: error.message }; // Handle error with a message
    }
    return { success: false, message: "An unknown error occurred" }; // Fallback for unknown errors
  }
};

// Function to fetch product categories
export const fetchProductCategories = async () => {
  try {
    const productCategoryRef = collection(db, "productCategory");
    const productSnapshot = await getDocs(productCategoryRef);

    const productCategories = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return productCategories;
  } catch (error) {
    console.error("Error fetching product categories: ", error);
    return [];
  }
};

export const fetchProductByProductId = async (productId: string) => {
  try {
    // Reference to the specific product document by productId
    const productDocRef = doc(db, "productCategory", productId);

    // Fetch the product document
    const productSnapshot = await getDoc(productDocRef);

    if (!productSnapshot.exists()) {
      throw new Error("Product not found");
    }

    // Return the product data along with the document id
    return {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    };
  } catch (error) {
    console.error("Error fetching product by product ID: ", error);
    return null;
  }
};

export const fetchBatchesByProductId = async (productId: string) => {
  try {
    // Reference to the batches subcollection for a specific product
    const batchesRef = collection(db, `productCategory/${productId}/batches`);

    // Fetch all documents from the batches subcollection
    const batchSnapshot = await getDocs(batchesRef);

    // Map over the batch documents and return their data
    const batches = batchSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return batches; // Return the array of batch objects
  } catch (error) {
    console.error("Error fetching batches for product ID: ", error);
    return [];
  }
};

export const addBatchToProduct = async (
  productId: string,
  limitQuantity: number,
  testReport: File | null
) => {
  try {
    const batchCollectionRef = collection(
      db,
      `productCategory/${productId}/batches`
    );
    const batchQuery = query(batchCollectionRef, orderBy("batchNo", "desc"));
    const batchSnapshot = await getDocs(batchQuery);

    // Initialize the first batch number
    let newBatchNo = "001";

    if (!batchSnapshot.empty) {
      const lastBatch = batchSnapshot.docs[0].data();
      const lastBatchNo = parseInt(lastBatch.batchNo);
      newBatchNo = (lastBatchNo + 1).toString().padStart(3, "0"); // Increment batch number and pad with leading zeros
    }

    let reportUrl = "";
    if (testReport) {
      const storageRef = ref(
        storage,
        `testReport/${uuidv4()}-${testReport.name}`
      );
      const snapshot = await uploadBytes(storageRef, testReport);
      reportUrl = await getDownloadURL(snapshot.ref); // Get the uploaded image's URL
    }

    // Add a new batch to the batches subcollection
    const batchRef = await addDoc(batchCollectionRef, {
      batchNo: newBatchNo, // Store the incremented batch number
      limitQuantity,
      testReport: reportUrl, // Add test report URL if provided
    });

    return batchRef.id; // Return the newly created batch ID
  } catch (error) {
    console.error("Error adding batch: ", error);
    if (error instanceof Error) {
      return { success: false, message: error.message }; // Handle the error with a message
    }
    return { success: false, message: "An unknown error occurred" }; // Fallback for unknown errors
  }
};

// export const addBatchToProduct = async (productId: string, limit:number, quantity: number, testReportUrl: string) => {
//   try {
//     const batchCollectionRef = collection(db, `productCategory/${productId}/batches`);
//     const batchQuery = query(batchCollectionRef, orderBy('batchNo', 'desc'));
//     const batchSnapshot = await getDocs(batchQuery);

//     // Initialize the first batch number
//     let newBatchNo = '001';

//     if (!batchSnapshot.empty) {
//       const lastBatch = batchSnapshot.docs[0].data();
//       const lastBatchNo = parseInt(lastBatch.batchNo);
//       newBatchNo = (lastBatchNo + 1).toString().padStart(3, '0'); // Increment batch number and pad with leading zeros
//     }

//     // Add a new batch to the batches subcollection
//     const batchRef = await addDoc(batchCollectionRef, {
//       batchNo: newBatchNo,  // Store the incremented batch number
//       limit,
//       quantity,
//       testReportUrl,  // Add test report URL if provided
//     });

//     const batchId = batchRef.id; // The newly created batch ID

//     // Create a package subcollection for the batch
//     const packageCollectionRef = collection(db, `productCategory/${productId}/batches/${batchId}/packages`);

//     //productNo
//     const productCategoryRef = doc(collection(db, 'productCategory'), productId);
//     const productDoc = await getDoc(productCategoryRef);

//     const productData = productDoc.data();
//     const productNo = productData?.productCategoryId;
//     // Create multiple packages based on the provided quantity
//     for (let i = 1; i <= quantity; i++) {
//       const packageNo = i.toString().padStart(3, '0'); // Generate package number as a string, padded with zeros
//       const serialNo = `${productNo}-${newBatchNo}-${packageNo}`;  // Generate the serial number

//       // Add the package to the package subcollection
//       const packageRef = await addDoc(packageCollectionRef, {
//         packageNo,
//         serialNo,
//       });

//       // Store the package ID in the serial numbers collection
//       const serialNoCollectionRef = collection(db, `serialNumbers`);

//       await addDoc(serialNoCollectionRef, {
//         productCategoryId: productId,
//         batchId,
//         packageId: packageRef.id,  // Store the newly created package ID
//         serialNo,  // Store the serial number globally
//       });
//     }

//     return batchRef.id;  // Return the newly created batch ID
//   } catch (error) {
//     console.error("Error adding batch: ", error);
//     if (error instanceof Error) {
//       return { success: false, message: error.message };  // Handle the error with a message
//     }
//     return { success: false, message: 'An unknown error occurred' };  // Fallback for unknown errors
//   }
// };

export const fetchBatchDetails = async (productId: string, batchId: string) => {
  try {
    // Reference to the specific batch document
    const batchDocRef = doc(
      db,
      `productCategory/${productId}/batches/${batchId}`
    );

    // Fetch the batch document
    const batchDoc = await getDoc(batchDocRef);

    // Check if the document exists and return the data
    if (batchDoc.exists()) {
      const batchData = {
        id: batchDoc.id,
        ...batchDoc.data(),
      };
      return batchData; // Return the batch data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching batch details for product ID: ", error);
    return null;
  }
};

export const fetchPackageDetails = async (
  productId: string,
  batchId: string
) => {
  try {
    // Reference to the packages subcollection for a specific batch
    const packagesRef = collection(
      db,
      `productCategory/${productId}/batches/${batchId}/packages`
    );

    // Fetch all documents from the packages subcollection
    const packageSnapshot = await getDocs(packagesRef);

    // Map over the package documents and return their data
    const packages = packageSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return packages; // Return the array of package objects
  } catch (error) {
    console.error("Error fetching packages for product ID: ", error);
    return []; // Return an empty array on error
  }
};

export const addPackageToBatch = async (
  productId: string,
  batchId: string,
  refractometerReport: string
) => {
  try {
    //productNo
    const productCategoryRef = doc(
      collection(db, "productCategory"),
      productId
    );
    const productDoc = await getDoc(productCategoryRef);
    const productData = productDoc.data();
    const productNo = productData?.productCategoryId;

    //batchNo
    const batchCategoryRef = doc(
      collection(db, "productCategory", productId, "batches"),
      batchId
    );

    
    const batchDoc = await getDoc(batchCategoryRef);
    const batchData = batchDoc.data();
    const batchNo = batchData?.batchNo;
    
    // Step 3: Get current quantity from batch
    let currentQuantity = batchData?.quantity || 0;
    
    const packageCollectionRef = collection(
      db,
      `productCategory/${productId}/batches/${batchId}/packages`
    );
    const packageQuery = query(
      packageCollectionRef,
      orderBy("packageNo", "desc")
    );
    const packageSnapshot = await getDocs(packageQuery);
    // Initialize the first package number
    let newPackageNo = "001";

    if (!packageSnapshot.empty) {
      const lastPackage = packageSnapshot.docs[0].data();
      const lastPackageNo = parseInt(lastPackage.packageNo);
      newPackageNo = (lastPackageNo + 1).toString().padStart(3, "0");
      // console.log(newPackageNo)
    }

    // const quantity = parseInt(newPackageNo);
    // console.log("quantity", quantity);

    const serialNo = `${productNo}-${batchNo}-${newPackageNo}`; // Serial number format

    // Add the package to the package subcollection
    const packageRef = await addDoc(packageCollectionRef, {
      packageNo: newPackageNo,
      serialNo,
      refractometerReport,
    });
    // Add to serial numbers collection
    await addDoc(collection(db, "serialNumbers"), {
      productCategoryId: productId,
      batchId,
      packageId: packageRef.id, // Use package reference ID
      serialNo, // Store the serial number globally
    });
    // }

    currentQuantity += 1; // Increment quantity by 1 for the new package
    await updateDoc(batchCategoryRef, {
      quantity: currentQuantity, // Update batch with the new quantity
    });

    return packageRef.id; // Return the newly created package ID
  } catch (error) {
    console.error("Error adding package: ", error);
    if (error instanceof Error) {
      return { success: false, message: error.message }; // Handle the error with a message
    }
    return { success: false, message: "An unknown error occurred" }; // Fallback for unknown errors
  }
};
