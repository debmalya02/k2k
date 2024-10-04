"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react"; // Optional icon for the button
import {
  fetchBatchDetails,
  fetchPackageDetails,
  addPackageToBatch,
} from "../../../../../../firebase/firebaseUtil"; // Import addPackageToBatch function

interface Props {
  params: {
    batchId: string;
    productId: string;
  };
}

interface BatchDetails {
  id: string;
  limitQuantity?: number;
  quantity?: number;
  batchNo?: string;
  testReport?: string;
}

const BatchDetails: React.FC<Props> = ({ params }) => {
  const [open, setOpen] = useState(false); // Dialog state
  const [refractometerReport, setRefractometerReport] = useState("");
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null); // State for batch details
  const [packageDetails, setPackageDetails] = useState<any[]>([]);

  const { batchId, productId } = params;

  // Fetch batch details when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const details = await fetchBatchDetails(productId, batchId);
      setBatchDetails(details);
      const packageDetails = await fetchPackageDetails(productId, batchId);
      setPackageDetails(packageDetails);
    };
    fetchData();
  }, [productId, batchId]);

  // Handle adding a new bottle (package) to the batch
  const handleAddBottle = async () => {
    try {
      // Call addPackageToBatch to create new packages for this batch
      await addPackageToBatch(productId, batchId, refractometerReport);

      // Refetch package details after adding a new package
      const updatedPackageDetails = await fetchPackageDetails(
        productId,
        batchId
      );
      setPackageDetails(updatedPackageDetails);

      // Reset state and close dialog
      setRefractometerReport("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding bottle:", error);
    }
  };

  // Function to open the test report in a new tab
  const handleOpenReportInNewTab = () => {
    if (batchDetails && batchDetails.testReport) {
      window.open(batchDetails.testReport, "_blank");
    } else {
      console.error("Test report URL not available");
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Batch Number Section */}
      <div className="bg-gray-300 p-4 rounded-md mb-4 text-center">
        <h1 className="text-xl font-semibold">
          Batch No: {batchDetails ? batchDetails.batchNo : ""}
        </h1>
      </div>

      {/* Batch Details & Report Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-yellow-400 p-4 rounded-md">
          <h2 className="font-semibold">Batch Details</h2>
          <p>
            Limit :{" "}
            {batchDetails
              ? batchDetails.limitQuantity?.toString()
              : "No BOTTLE"}
          </p>
          <p>
            Quantity :{" "}
            {batchDetails ? batchDetails.quantity?.toString() : "No Bottle"}
          </p>
        </div>
        {/* {batchDetails ? batchDetails.testReport:'NO report'} */}
        <Button className="text-white" onClick={handleOpenReportInNewTab}>
          Batch Report (PDF)
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-300">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Serial Number</th>
              <th className="px-4 py-2 border">Refractometer Report</th>
            </tr>
          </thead>
          <tbody>
            {packageDetails.length ? (
              packageDetails.map((row, index) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    {row.serialNo}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.refractometerReport}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 border text-center">
                  No batch details found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Bottle Button */}
      <div className="fixed bottom-8 right-8">
        <div className="fixed bottom-8 right-8">
          <Button
          
            disabled={
              batchDetails?.limitQuantity !== undefined &&
              batchDetails?.quantity !== undefined &&
              batchDetails.limitQuantity <= batchDetails.quantity
            }
            className="text-white flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Bottle
          </Button>
        </div>
      </div>

      {/* Add Bottle Dialog */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bottle</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {/* <div>
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
              </div> */}
              <div>
                <label
                  htmlFor="refractometer-report"
                  className="block text-sm font-medium"
                >
                  Refractometer Report
                </label>
                <Textarea
                  id="refractometer-report"
                  value={refractometerReport}
                  onChange={(e) => setRefractometerReport(e.target.value)}
                  className="w-full mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-green-500 text-white"
                onClick={handleAddBottle}
              >
                Add Bottle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BatchDetails;
