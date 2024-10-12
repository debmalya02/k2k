// 'use client'

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus } from 'lucide-react'; // Optional icon for the button

// const BatchPage = () => {
//   const [open, setOpen] = useState(false); // Dialog state
//   const [quantity, setQuantity] = useState('');
//   const [refractometerReport, setRefractometerReport] = useState('');

//   // Sample table data
//   const tableData = [
//     { id: 1, date: '2024-09-30', refractometerDetails: 'Detail 1' },
//     { id: 2, date: '2024-09-29', refractometerDetails: 'Detail 2' },
//     { id: 3, date: '2024-09-28', refractometerDetails: 'Detail 3' },
//   ];

//   const handleAddBottle = () => {
//     // Logic for adding bottle
//     setOpen(false); // Close dialog after submitting
//   };

//   return (
//     <div className="min-h-screen p-8">
//       {/* Batch Number Section */}
//       <div className="bg-gray-300 p-4 rounded-md mb-4 text-center">
//         <h1 className="text-xl font-semibold">Batch No. 12345</h1>
//       </div>

//       {/* Batch Details & Report Button */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="bg-yellow-400 p-4 rounded-md">
//           <h2 className="font-semibold">Batch Details</h2>
//           <p>Some details about this batch.</p>
//         </div>
//         <Button className=" text-white">Batch Report (PDF)</Button>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-gray-300">
//           <thead className="bg-gray-400">
//             <tr>
//               <th className="px-4 py-2 border">Sl No</th>
//               <th className="px-4 py-2 border">Added Date</th>
//               <th className="px-4 py-2 border">Refractometer Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, index) => (
//               <tr key={row.id}>
//                 <td className="px-4 py-2 border text-center">{index + 1}</td>
//                 <td className="px-4 py-2 border text-center">{row.date}</td>
//                 <td className="px-4 py-2 border">{row.refractometerDetails}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Floating Add Bottle Button */}
//       <div className="fixed bottom-8 right-8">
//         <Button className=" text-white flex items-center gap-2" onClick={() => setOpen(true)}>
//           <Plus className="w-4 h-4" /> Add Bottle
//         </Button>
//       </div>

//       {/* Add Bottle Dialog */}
//       {open && (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Bottle</DialogTitle>
//             </DialogHeader>
//             <div className="mt-4 space-y-4">
//               <div>
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
//               </div>
//               <div>
//                 <label htmlFor="refractometer-report" className="block text-sm font-medium">
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
//               <Button className="bg-green-500 text-white" onClick={handleAddBottle}>
//                 Add Bottle
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default BatchPage;




