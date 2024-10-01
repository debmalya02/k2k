// "use client";

// import { useState, ChangeEvent, FormEvent } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import Image from 'next/image';

// interface Product {
//   name: string;
//   description: string;
// }

// interface Batch {
//   batchNumber: string;
//   product: string;
//   quantityLimit: number;
//   currentQuantity: number;
//   testReport: string | null;
// }

// export default function AdminPanel() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [batches, setBatches] = useState<Batch[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<string>('');

//   const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const name = form.productName.value;
//     const description = form.productDescription.value;
    
//     setProducts((prev) => [...prev, { name, description }]);
//     form.reset();
//   };

//   const handleCreateBatch = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const batchNumber = form.batchNumber.value;
//     const quantityLimit = parseInt(form.quantityLimit.value);
//     const testReport = (form.testReport as HTMLInputElement).files?.[0];

//     setBatches((prev) => [
//       ...prev,
//       {
//         batchNumber,
//         product: selectedProduct,
//         quantityLimit,
//         currentQuantity: 0,
//         testReport: testReport ? URL.createObjectURL(testReport) : null,
//       },
//     ]);
//     form.reset();
//   };

//   const handleAddSerialNumber = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const batchNumber = form.batchNumber.value;
//     const serialNumber = form.serialNumber.value; // This value is not currently used, but you might want to store it.

//     setBatches((prev) =>
//       prev.map((batch) =>
//         batch.batchNumber === batchNumber && batch.currentQuantity < batch.quantityLimit
//           ? { ...batch, currentQuantity: batch.currentQuantity + 1 }
//           : batch
//       )
//     );
//     form.reset();
//   };

//   const handleProductSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setSelectedProduct(e.target.value);
//   };

//   return (
//     <div className="space-y-8 p-10 m-10">
//       {/* Add New Product */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
//         <form onSubmit={handleAddProduct} className="space-y-4">
//           <div>
//             <Label htmlFor="productName">Product Name</Label>
//             <Input id="productName" name="productName" required />
//           </div>
//           <div>
//             <Label htmlFor="productDescription">Product Description</Label>
//             <Textarea id="productDescription" name="productDescription" required />
//           </div>
//           <Button type="submit">Add Product</Button>
//         </form>
//       </section>

//       {/* Create Batch */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Create Batch</h2>
//         <form onSubmit={handleCreateBatch} className="space-y-4">
//           <div>
//             <Label htmlFor="productSelect">Select Product</Label>
//             <Select
//               name="productSelect"
//               value={selectedProduct}
//               onValueChange={(value) => setSelectedProduct(value)}
//               required
//             >
//               <option value="">Select a product</option>
//               {products.map((product, index) => (
//                 <option key={index} value={product.name}>
//                   {product.name}
//                 </option>
//               ))}
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="batchNumber">Batch Number</Label>
//             <Input id="batchNumber" name="batchNumber" required />
//           </div>
//           <div>
//             <Label htmlFor="quantityLimit">Quantity Limit</Label>
//             <Input id="quantityLimit" name="quantityLimit" type="number" required />
//           </div>
//           <div>
//             <Label htmlFor="testReport">Test Report</Label>
//             <Input id="testReport" name="testReport" type="file" accept=".pdf,.doc,.docx" />
//           </div>
//           <Button type="submit">Create Batch</Button>
//         </form>
//       </section>

//       {/* List Batches */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Batches</h2>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Batch Number</TableHead>
//               <TableHead>Product Name</TableHead>
//               <TableHead>Quantity Limit</TableHead>
//               <TableHead>Current Quantity</TableHead>
//               <TableHead>Test Report</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {batches.map((batch, index) => (
//               <TableRow key={index}>
//                 <TableCell>{batch.batchNumber}</TableCell>
//                 <TableCell>{batch.product}</TableCell>
//                 <TableCell>{batch.quantityLimit}</TableCell>
//                 <TableCell>{batch.currentQuantity}</TableCell>
//                 <TableCell>
//                   {batch.testReport && (
//                     <a href={batch.testReport} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                       View Report
//                     </a>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </section>

//       {/* Add Serial Number */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">Add Serial Number</h2>
//         <form onSubmit={handleAddSerialNumber} className="space-y-4">
//           <div>
//             <Label htmlFor="serialBatchNumber">Batch Number</Label>
//             <Input id="serialBatchNumber" name="batchNumber" required />
//           </div>
//           <div>
//             <Label htmlFor="serialNumber">Serial Number</Label>
//             <Input id="serialNumber" name="serialNumber" required />
//           </div>
//           <Button type="submit">Add Serial Number</Button>
//         </form>
//       </section>
//     </div>
//   );
// }





"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchProductCategories, addProduct } from '../../../firebase/firebaseUtil'; // Adjust path as needed

export default function AdminPanel() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productCategories, setProductCategories] = useState<any[]>([]);  // Hold fetched categories
  const [loading, setLoading] = useState(false);  // For submit button loading state
  const [error, setError] = useState<string | null>(null);  // Error handling

  useEffect(() => {
    // Fetch product categories when the component mounts
    const loadCategories = async () => {
      const categories = await fetchProductCategories();
      setProductCategories(categories);
    };
    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);  // Reset error before submission
    try {
      // Call the addProduct function and pass necessary data
      const result = await addProduct(productName, productDetails, productImage);
      if (result.success) {
        // Reload categories after successful addition
        const categories = await fetchProductCategories();
        setProductCategories(categories);
        setIsDialogOpen(false);
        setProductName("");
        setProductDetails("");
        setProductImage(null);
      } else {
        setError(result.message);  // Show error message
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] w-full flex flex-col items-center">
      <div className="grid grid-cols-4 gap-4" >
        
        {productCategories.map((category, index) => (
          <Link
            href = {`/admin/${category.id}/create_batch`}
            key={index}
            className="w-48 h-48 bg-slate-300 flex flex-col items-center justify-center text-black rounded-md shadow-md"
          >
            <h3 className="font-bold text-lg">{category.productName}</h3>
            <p className="text-sm">{category.productDetails}</p>
            {category.productImage && (
              <img
                src={category.productImage}
                alt={category.productName}
                className="w-32 h-32 object-cover mt-2"
              />
            )}
          </Link>
        ))}
      </div>

      <Button
        className="px-4 rounded-md fixed bottom-4 right-4"
        onClick={() => setIsDialogOpen(true)}
      >
        Add new Product
      </Button>

      {/* Dialog for adding a new product */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="mb-4"
            />
            <Input
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder="Enter product details"
              className="mb-4"
            />
            <Input
              type="file"
              onChange={handleFileChange}
              className="mb-4"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
