"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { fetchProductByProductId, addBatchToProduct, fetchBatchesByProductId } from '../../../../../firebase/firebaseUtil'; // Import functions

interface Props {
  params: {
    productId: string;
  };
}

const BatchesPage: React.FC<Props> = ({ params }) => {
  const [open, setOpen] = useState(false); // Dialog state management
  const [batches, setBatches] = useState<any[]>([]); // Store fetched data
  const [quantity, setQuantity] = useState('');
  const [testReport, setTestReport] = useState<File | null>(null);
  const [batchNo, setBatchNo] = useState(''); // Initialize with default batch number
  const [testReportUrl, setTestReportUrl] = useState<string | null>(''); // Store test report URL

  const { productId } = params;

  // Fetch product batches and set batch number
  useEffect(() => {
    const fetchData = async () => {
      const product = await fetchProductByProductId(productId);
      const fetchedBatches = await fetchBatchesByProductId(productId);
      setBatches(fetchedBatches);
    };

    fetchData();
  }, [productId]);

  // When the dialog is opened, calculate the next batch number
  const handleDialogOpen = () => {
    if (batches.length > 0) {
      // Find the highest batch number and increment it
      const lastBatchNo = Math.max(...batches.map(batch => parseInt(batch.batchNo, 10))) || 0;
      setBatchNo((lastBatchNo + 1).toString().padStart(3, '0'));
    } else {
      // If no batches, start from 001
      setBatchNo('001');
    }
    setOpen(true);
  };

  const handleCreateBatch = async () => {
    // Upload the test report and get its URL (if necessary)
    const testReportUrl = testReport ? await uploadTestReport(testReport) : '';

    // Call the function to add the new batch to Firestore
    const newBatchId = await addBatchToProduct(productId, Number(quantity), testReportUrl);

    // Update the batches state with the newly added batch
    setBatches([...batches, { id: newBatchId, batchNo, quantity, testReportUrl }]);

    setQuantity(''); // Clear the quantity field
    setTestReport(null); // Clear the file input
    setOpen(false); // Close the dialog
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTestReport(e.target.files[0]);
    }
  };

  const uploadTestReport = async (file: File) => {
    // Simulate file upload to get a file URL, replace with actual upload logic
    const url = URL.createObjectURL(file); // Example, replace this with actual upload logic
    return url;
  };

  return (
    <div className="min-h-screen p-8">
      {/* Product Section */}
      <div className="bg-gray-300 p-4 rounded-md mb-4 text-center">
        <h1 className="text-xl font-semibold">Product Name (ID: {productId})</h1>
      </div>
      <div className="bg-gray-300 p-4 rounded-md mb-6 text-center">
        <p>Product Details</p>
      </div>

      {/* Batches Section */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {batches.map((batch, index) => (
          <div key={index} className="bg-yellow-400 p-4 rounded-md text-center">
            Batch no {batch.batchNo || `Batch ${index + 1}`}
          </div>
        ))}
      </div>

      {/* Add Batch Button */}
      <div className="flex justify-end">
        <Button className="text-white flex items-center gap-2" onClick={handleDialogOpen}>
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
                  <Input id="batch-no" value={`${batchNo}`} readOnly className="w-full mt-1" />
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
