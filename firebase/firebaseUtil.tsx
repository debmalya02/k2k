// firebaseUtil.tsx
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import {app,db,storage} from './firebaseConfig'

import { doc, getDoc } from 'firebase/firestore';

// Function to add a new product
export const addProduct = async (productName: string, productDetails: string, productImage: File | null) => {
  try {
    console.log('add product called')
    // Step 1: Generate the next productCategoryId
    const productCategoryRef = collection(db, 'productCategory');
    const productQuery = query(productCategoryRef, orderBy('productCategoryId', 'desc'));
    const productSnapshot = await getDocs(productQuery);

    let newProductCategoryId = '001'; // Default for the first product

    if (!productSnapshot.empty) {
      const lastProduct = productSnapshot.docs[0].data();
      const lastProductCategoryId = parseInt(lastProduct.productCategoryId);
      newProductCategoryId = (lastProductCategoryId + 1).toString().padStart(3, '0');
    }

    // Step 2: Upload image to Firebase Storage
    let imageUrl = '';
    if (productImage) {
      const storageRef = ref(storage, `products/${uuidv4()}-${productImage.name}`);
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
    console.log(product)

    return { success: true, message: 'Product added successfully' };
  } catch (error) {
    console.error('Error adding product: ', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };  // Handle error with a message
    }
    return { success: false, message: 'An unknown error occurred' };  // Fallback for unknown errors
  }
};


// Function to fetch product categories
export const fetchProductCategories = async () => {
  try {
    const productCategoryRef = collection(db, 'productCategory');
    const productSnapshot = await getDocs(productCategoryRef);

    const productCategories = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return productCategories;
  } catch (error) {
    console.error('Error fetching product categories: ', error);
    return [];
  }
};


export const fetchProductByProductId = async (productId: string) => {
  try {
    // Reference to the specific product document by productId
    const productDocRef = doc(db, 'productCategory', productId);
    
    // Fetch the product document
    const productSnapshot = await getDoc(productDocRef);

    if (!productSnapshot.exists()) {
      throw new Error('Product not found');
    }

    // Return the product data along with the document id
    return {
      id: productSnapshot.id,
      ...productSnapshot.data(),
    };
  } catch (error) {
    console.error('Error fetching product by product ID: ', error);
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
    console.error('Error fetching batches for product ID: ', error);
    return [];
  }
};

export const addBatchToProduct = async (productId: string, quantity: number, testReportUrl: string) => {
  try {
    const batchCollectionRef = collection(db, `productCategory/${productId}/batches`);
    const batchQuery = query(batchCollectionRef, orderBy('batchNo', 'desc'));
    const batchSnapshot = await getDocs(batchQuery);

    // Initialize the first batch number
    let newBatchNo = '001';

    if (!batchSnapshot.empty) {
      const lastBatch = batchSnapshot.docs[0].data();
      const lastBatchNo = parseInt(lastBatch.batchNo);
      newBatchNo = (lastBatchNo + 1).toString().padStart(3, '0'); // Increment batch number and pad with leading zeros
    }

    // Add a new batch to the batches subcollection
    const batchRef = await addDoc(batchCollectionRef, {
      batchNo: newBatchNo,  // Store the incremented batch number
      quantity,
      testReportUrl,  // Add test report URL if provided
    });

    return batchRef.id;  // Return the newly created batch ID
  } catch (error) {
    console.error("Error adding batch: ", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };  // Handle the error with a message
    }
    return { success: false, message: 'An unknown error occurred' };  // Fallback for unknown errors
  }
};

