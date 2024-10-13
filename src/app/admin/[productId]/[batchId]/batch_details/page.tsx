// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus } from "lucide-react"; // Optional icon for the button
// import {
//   fetchBatchDetails,
//   fetchPacketDetails,
//   addPacketToBatch,
// } from "../../../../../../firebase/firebaseUtil"; // Import addPacketToBatch function

// interface Props {
//   params: {
//     batchId: string;
//     productId: string;
//   };
// }

// interface BatchDetails {
//   id: string;
//   limitQuantity?: number;
//   quantity?: number;
//   batchNo?: string;
//   testReport?: string;
// }

// const BatchDetails: React.FC<Props> = ({ params }) => {
//   const [open, setOpen] = useState(false); // Dialog state
//   const [refractometerReport, setRefractometerReport] = useState("");
//   const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null); // State for batch details
//   const [packetDetails, setpacketDetails] = useState<any[]>([]);

//   const { batchId, productId } = params;

//   // Fetch batch details when the component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       const details = await fetchBatchDetails(productId, batchId);
//       setBatchDetails(details);
//       const packetDetails = await fetchPacketDetails(productId, batchId);
//       setpacketDetails(packetDetails);
//     };
//     fetchData();
//   }, [productId, batchId]);

//   // Handle adding a new bottle (packet) to the batch
//   const handleAddBottle = async () => {
//     try {
//       // Call addPacketToBatch to create new packets for this batch
//       await addPacketToBatch(productId, batchId, refractometerReport);

//       // Refetch packet details after adding a new packet
//       const updatedpacketDetails = await fetchPacketDetails(
//         productId,
//         batchId
//       );
//       setpacketDetails(updatedpacketDetails);

//       // Reset state and close dialog
//       setRefractometerReport("");
//       setOpen(false);
//     } catch (error) {
//       console.error("Error adding bottle:", error);
//     }
//   };

//   // Function to open the test report in a new tab
//   const handleOpenReportInNewTab = () => {
//     if (batchDetails && batchDetails.testReport) {
//       window.open(batchDetails.testReport, "_blank");
//     } else {
//       console.error("Test report URL not available");
//     }
//   };

//   return (
//     <div className="min-h-screen p-8">
//       {/* Batch Number Section */}
//       <div className="bg-gray-300 p-4 rounded-md mb-4 text-center">
//         <h1 className="text-xl font-semibold">
//           Batch No: {batchDetails ? batchDetails.batchNo : ""}
//         </h1>
//       </div>

//       {/* Batch Details & Report Button */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="bg-yellow-400 p-4 rounded-md">
//           <h2 className="font-semibold">Batch Details</h2>
//           <p>
//             Limit :{" "}
//             {batchDetails
//               ? batchDetails.limitQuantity?.toString()
//               : "No BOTTLE"}
//           </p>
//           <p>
//             Quantity :{" "}
//             {batchDetails ? batchDetails.quantity?.toString() : "No Bottle"}
//           </p>
//         </div>
//         {/* {batchDetails ? batchDetails.testReport:'NO report'} */}
//         <Button className="text-white" onClick={handleOpenReportInNewTab}>
//           Batch Report (PDF)
//         </Button>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-gray-300">
//           <thead className="bg-gray-400">
//             <tr>
//               <th className="px-4 py-2 border">No</th>
//               <th className="px-4 py-2 border">Serial Number</th>
//               <th className="px-4 py-2 border">Refractometer Report</th>
//             </tr>
//           </thead>
//           <tbody>
//             {packetDetails.length ? (
//               packetDetails.map((row, index) => (
//                 <tr key={row.id}>
//                   <td className="px-4 py-2 border text-center">{index + 1}</td>
//                   <td className="px-4 py-2 border text-center">
//                     {row.serialNo}
//                   </td>
//                   <td className="px-4 py-2 border text-center">
//                     {row.refractometerReport}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="px-4 py-2 border text-center">
//                   No batch details found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Floating Add Bottle Button */}
//       <div className="fixed bottom-8 right-8">
//         <div className="fixed bottom-8 right-8">
//           <Button

//             disabled={
//               batchDetails?.limitQuantity !== undefined &&
//               batchDetails?.quantity !== undefined &&
//               batchDetails.limitQuantity <= batchDetails.quantity
//             }
//             className="text-white flex items-center gap-2"
//             onClick={() => setOpen(true)}
//           >
//             <Plus className="w-4 h-4" /> Add Bottle
//           </Button>
//         </div>
//       </div>

//       {/* Add Bottle Dialog */}
//       {open && (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Bottle</DialogTitle>
//             </DialogHeader>
//             <div className="mt-4 space-y-4">
//               {/* <div>
//                 <label htmlFor="quantity" className="block text-sm font-medium">
//                   Quantity
//                 </label>
//                 <Input
//                   id="quantity"
//                   type="number"
//                   value={quantity}
//                   onChange={(e) => setQuantity(e.target.value)}
//                   className="w-full mt-1"
//                 />
//               </div> */}
//               <div>
//                 <label
//                   htmlFor="refractometer-report"
//                   className="block text-sm font-medium"
//                 >
//                   Refractometer Report
//                 </label>
//                 <Textarea
//                   id="refractometer-report"
//                   value={refractometerReport}
//                   onChange={(e) => setRefractometerReport(e.target.value)}
//                   className="w-full mt-1"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 className="bg-green-500 text-white"
//                 onClick={handleAddBottle}
//               >
//                 Add Bottle
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default BatchDetails;



"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Plus, Package, List, ArrowUp, ArrowDown } from "lucide-react"; // Added ArrowUp and ArrowDown for sorting icons
import {
  fetchBatchDetails,
  fetchPacketDetails,
  addPacketToBatch,
  generatePackets,
} from "../../../../../../firebase/firebaseUtil";
import { useRouter } from "next/navigation"; // For navigation to other pages
import * as XLSX from "xlsx"; // Importing xlsx for Excel export

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

interface packetDetails {
  id: string;
  serialNo?: string; // Made optional
  refractometerReport?: string; // Made optional
}

type SortKey = "no" | "serialNo" | null;
type SortDirection = "asc" | "desc";

const BatchDetails: React.FC<Props> = ({ params }) => {
  const [open, setOpen] = useState(false); // Dialog state for adding bottle
  const [openGeneratePacket, setOpenGeneratePacket] = useState(false); // Dialog state for generating packet
  const [refractometerReport, setRefractometerReport] = useState("");
  const [packetQuantity, setPacketQuantity] = useState(0); // State for quantity input in Generate Packet dialog
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null); // State for batch details
  const [packetDetails, setpacketDetails] = useState<packetDetails[]>([]); // State for packet details

  const [isLoading, setIsLoading] = useState(false); // Loading state for adding a bottle
  const router = useRouter(); // For navigation

  const { batchId, productId } = params;

  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Fetch batch details and packets on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchBatchDetails(productId, batchId);
        setBatchDetails(details);
        const packets = await fetchPacketDetails(productId, batchId);
        setpacketDetails(packets);
      } catch (error) {
        console.error("Error fetching batch or packet details:", error);
      }
    };
    fetchData();
  }, [productId, batchId]);

  // Handle adding a new bottle (packet) to the batch
  const handleAddBottle = async () => {
    setIsLoading(true);
    try {
      await addPacketToBatch(productId, batchId, refractometerReport);

      // Fetch updated packet details after adding a new packet
      const updatedpackets = await fetchPacketDetails(productId, batchId);
      setpacketDetails(updatedpackets);

      // Reset state and close dialog
      setRefractometerReport("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding bottle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle generating new packets
  const handleGeneratePacket = async () => {
    try {
      await generatePackets(productId, batchId, packetQuantity);
      setOpenGeneratePacket(false); // Close the dialog after successful generation
    } catch (error) {
      console.error("Error generating packets:", error);
    }
  };

  // Open test report in a new tab
  const handleOpenReportInNewTab = () => {
    const reportUrl = batchDetails?.testReport;
    if (reportUrl) {
      window.open(reportUrl, "_blank");
    } else {
      console.error("Test report URL not available");
    }
  };

  // Navigate to the existing packets page
  const handleViewExistingPackets = () => {
    router.push(`/admin/${productId}/${batchId}/existing_packets`);
  };

  // Handle sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle sort direction if the same column is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort key and default to ascending
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Sort packet details based on sortKey and sortDirection
  const sortedpacketDetails = useMemo(() => {
    return [...packetDetails].sort((a, b) => {
      if (!sortKey) return 0; // No sorting
      let aValue: any;
      let bValue: any;

      // if (sortKey === "no") {
      //   aValue = packetDetails.indexOf(a) + 1;
      //   bValue = packetDetails.indexOf(b) + 1;
      // }
      if (sortKey === "serialNo") {
        aValue = a.serialNo?.toLowerCase() || "";
        bValue = b.serialNo?.toLowerCase() || "";
      } else {
        return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [packetDetails, sortKey, sortDirection]);

  // Handle Export to Excel
  const handleExportToExcel = () => {
    // Prepare data for Excel
    const data = sortedpacketDetails.map((pkg, index) => ({
      No: index + 1,
      "Serial Number": pkg.serialNo || "",
      "Refractometer Report": pkg.refractometerReport || "",
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Details");
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    // Create a blob
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    // Trigger download
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Batch_${batchDetails?.batchNo || batchId}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* Batch Number Section */}
      <div className="bg-blue-600 p-6 rounded-md mb-6 text-center shadow-md text-white">
        <h1 className="text-2xl font-bold">
          Batch No: {batchDetails?.batchNo || "Loading..."}
        </h1>
      </div>

      {/* Batch Details & Report Button */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        <div className="bg-yellow-400 p-6 rounded-md shadow-md flex-1">
          <h2 className="text-lg font-semibold">Batch Details</h2>
          <p>Limit: {batchDetails?.limitQuantity ?? "Not specified"}</p>
          <p>Quantity: {batchDetails?.quantity ?? "Not available"}</p>
        </div>
        <Button
          className="text-white bg-red-600 hover:bg-red-700"
          onClick={handleOpenReportInNewTab}
        >
          View Batch Report (PDF)
        </Button>
      </div>

      {/* Export to Excel Button */}
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-md">
        <table className="min-w-full bg-gray-100">
          <thead className="bg-gray-300">
            <tr>
              {/* No Column with Sorting */}
              <th
                className="px-6 py-3 border cursor-pointer text-center"
                onClick={() => handleSort("no")}
              >
                <div className="inline-flex items-center">
                  No
                  {/* {sortKey === "no" && (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 w-4 h-4 inline" />
                    ) : (
                      <ArrowDown className="ml-1 w-4 h-4 inline" />
                    )
                  )} */}
                </div>
              </th>
              {/* Serial Number Column with Sorting */}
              <th
                className="px-6 py-3 border cursor-pointer text-center"
                onClick={() => handleSort("serialNo")}
              >
                <div className="inline-flex items-center">
                  Serial Number
                  {sortKey === "serialNo" && (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 w-4 h-4 inline" />
                    ) : (
                      <ArrowDown className="ml-1 w-4 h-4 inline" />
                    )
                  )}
                </div>
              </th>
              {/* Refractometer Report Column without Sorting */}
              <th className="px-6 py-3 border text-center">Refractometer Report</th>
            </tr>
          </thead>
          <tbody>
            {sortedpacketDetails.length ? (
              sortedpacketDetails.map((pkg, index) => (
                <tr key={pkg.id} className="hover:bg-gray-200">
                  <td className="px-6 py-4 border text-center">{index + 1}</td>
                  <td className="px-6 py-4 border text-center">{pkg.serialNo || "N/A"}</td>
                  <td className="px-6 py-4 border text-center">{pkg.refractometerReport || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 border text-center">
                  No packet details found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 space-y-4">
        {/* Generate Packet Button */}
        <Button
          className="text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setOpenGeneratePacket(true)}
        >
          <Package className="w-4 h-4" /> Generate Packet
        </Button>

        {/* Existing Packet Button */}
        <Button
          className="text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={handleViewExistingPackets}
        >
          <List className="w-4 h-4" /> Existing Packets
        </Button>
      </div>

      {/* Add Bottle Dialog */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bottle</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
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
                  className="w-full mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className={`bg-green-500 text-white ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleAddBottle}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Bottle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Generate Packet Dialog */}
      {openGeneratePacket && (
        <Dialog open={openGeneratePacket} onOpenChange={setOpenGeneratePacket}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Packets</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="packet-quantity" className="block text-sm font-medium">
                  Quantity
                </label>
                <Input
                  id="packet-quantity"
                  type="number"
                  value={packetQuantity}
                  onChange={(e) => setPacketQuantity(Number(e.target.value))}
                  className="w-full mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-indigo-500 text-white"
                onClick={handleGeneratePacket}
              >
                Generate Packets
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BatchDetails;
