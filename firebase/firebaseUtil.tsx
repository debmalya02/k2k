// firebaseUtil.tsx
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import {app,db,storage} from './firebaseConfig'



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