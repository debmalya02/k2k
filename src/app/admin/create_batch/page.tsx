"use client";

// import { FormEvent } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select } from '@/components/ui/select';

// interface Product {
//   name: string;
// }

// export default function CreateBatch({ products = [], onCreateBatch }: { products?: Product[], onCreateBatch: (batchData: any) => void }) {
//   const handleCreateBatch = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const batchNumber = form.batchNumber.value;
//     const quantityLimit = parseInt(form.quantityLimit.value);
//     const testReport = (form.testReport as HTMLInputElement).files?.[0];

//     onCreateBatch({
//       batchNumber,
//       product: form.productSelect.value,
//       quantityLimit,
//       currentQuantity: 0,
//       testReport: testReport ? URL.createObjectURL(testReport) : null,
//     });
//     form.reset();
//   };

//   return (
//     <section className="p-8">
//       <h2 className="text-2xl font-bold mb-4">Create Batch</h2>
//       <form onSubmit={handleCreateBatch} className="space-y-4">
//         <div>
//           <Label htmlFor="productSelect">Select Product</Label>
//           <Select name="productSelect" required>
//             <option value="">Select a product</option>
//             {products.length > 0 ? (
//               products.map((product, index) => (
//                 <option key={index} value={product.name}>
//                   {product.name}
//                 </option>
//               ))
//             ) : (
//               <option disabled>No products available</option>
//             )}
//           </Select>
//         </div>
//         <div>
//           <Label htmlFor="batchNumber">Batch Number</Label>
//           <Input id="batchNumber" name="batchNumber" required />
//         </div>
//         <div>
//           <Label htmlFor="quantityLimit">Quantity Limit</Label>
//           <Input id="quantityLimit" name="quantityLimit" type="number" required />
//         </div>
//         <div>
//           <Label htmlFor="testReport">Test Report</Label>
//           <Input id="testReport" name="testReport" type="file" accept=".pdf,.doc,.docx" />
//         </div>
//         <Button type="submit">Create Batch</Button>
//       </form>
//     </section>
//   );
// }

// pages/batches.tsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react'; // Optional icon for the button

const BatchesPage = () => {
  const [open, setOpen] = useState(false); // Dialog state management
  const [batches, setBatches] = useState([1, 2, 3, 4, 5, 6]); // Example batch list
  const [quantity, setQuantity] = useState('');
  const [testReport, setTestReport] = useState<File | null>(null);
  const [batchNo, setBatchNo] = useState(batches.length + 1);

  const handleCreateBatch = () => {
    setBatches([...batches, batchNo]);
    setBatchNo(batchNo + 1); // Increment for next batch
    setQuantity(''); // Reset form values
    setTestReport(null);
    setOpen(false); // Close dialog
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTestReport(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Product Section */}
      <div className="bg-gray-300 p-4 rounded-md mb-4 text-center">
        <h1 className="text-xl font-semibold">Product Name</h1>
      </div>
      <div className="bg-gray-300 p-4 rounded-md mb-6 text-center">
        <p>Product Details</p>
      </div>

      {/* Batches Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {batches.map((batch, index) => (
          <div key={index} className="bg-yellow-400 p-4 rounded-md text-center">
            Batch no {batch}
          </div>
        ))}
      </div>

      {/* Add Batch Button */}
      <div className="flex justify-end">
        <Button className="text-white flex items-center gap-2" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" /> Create new batch
        </Button>

        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="test-report" className="block text-sm font-medium">
                    Test Report
                  </label>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                </div>
                <div>
                  <label htmlFor="batch-no" className="block text-sm font-medium">
                    Generated Batch No
                  </label>
                  <Input id="batch-no" value={`Batch no ${batchNo}`} readOnly className="w-full mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-green-500 text-white" onClick={handleCreateBatch}>
                  Add Batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default BatchesPage;


