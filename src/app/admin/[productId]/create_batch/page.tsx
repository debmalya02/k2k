

'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { fetchProductByProductId, addBatchToProduct, fetchBatchesByProductId } from '../../../../../firebase/firebaseUtil'; // Import functions
import Link from 'next/link';

interface Props {
  params: {
    productId: string;
  };
}

interface ProductDetails {
  id: string;
  productName?: string;
  productDetails?: string;
  productImage?: string; // Add productImage to display product image
}

const BatchesPage: React.FC<Props> = ({ params }) => {
  const [open, setOpen] = useState(false); // Dialog state management
  const [batches, setBatches] = useState<any[]>([]); // Store fetched data
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null); // Store fetched data
  const [quantity, setQuantity] = useState('');
  const [testReport, setTestReport] = useState<File | null>(null);
  const [batchNo, setBatchNo] = useState(''); // Initialize with default batch number
  const [testReportUrl, setTestReportUrl] = useState<string | null>(''); // Store test report URL

  const { productId } = params;

  // Fetch product batches and set batch number
  useEffect(() => {
    const fetchData = async () => {
      const product = await fetchProductByProductId(productId);
      setProductDetails(product); // Update the state
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

    // Call the function to add the new batch to Firestore
    const newBatchId = await addBatchToProduct(productId, Number(quantity), testReport);

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



  return (
    <div className="min-h-screen p-8">
      {/* Product Name */}
      <h1 className="text-left text-3xl font-semibold mb-4">{productDetails?.productName || 'Product Name'}</h1>

      {/* Product Section: Image on the left, description on the right */}
      <div className="flex flex-wrap md:flex-nowrap justify-start items-start mb-6 gap-6">
        {/* Left Section: Product Image */}
        <div className="w-full md:w-1/3">
          {productDetails?.productImage ? (
            <img
              src={productDetails.productImage}
              alt={productDetails.productName || 'Product Image'}
              className="w-full h-auto md:w-auto md:h-64 object-cover rounded-md shadow-md"
              style={{ aspectRatio: '1/1' }} // Square format
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-md">
              No Image Available
            </div>
          )}
          
          {/* Add Batch Button */}
          <div className="mt-4">
            <Button className="text-white flex items-center gap-2 w-full" onClick={handleDialogOpen}>
              <Plus className="w-4 h-4" /> Create new batch
            </Button>
          </div>
        </div>

        {/* Right Section: Product Description */}
        <div className="w-full md:w-2/3">
          <div className="text-left">
            <p className="font-bold text-lg">Description:</p>
            <p className="text-gray-700 mt-2">{productDetails?.productDetails || 'Product Details'}</p>
          </div>
        </div>
      </div>

      {/* Batches Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {batches.map((batch, index) => (
          <Link href={`/admin/${productId}/${batch.id}/batch_details`} key={index} className="bg-yellow-400 p-4 rounded-md text-center">
            Batch no {batch.batchNo || `Batch ${index + 1}`}
          </Link>
        ))}
      </div>

      {/* Batch Dialog  */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Batch</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium">
                  Max Batch Size
                </label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full mt-1"
                  required
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
                  required

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
  );
};

export default BatchesPage;
