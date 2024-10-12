"use client";

import React, { useState, useEffect } from "react";
import { fetchExistingPackets } from "../../../../../../firebase/firebaseUtil"; // Import the Firebase function
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // For navigation back to batch details

interface PacketDetails {
  id: string;
  serialNo: string;
}

interface Props {
  params: {
    productId: string;
    batchId: string;
  };
}

const ExistingPacket: React.FC<Props> = ({ params }) => {
  const [existingPackets, setExistingPackets] = useState<any []>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter(); // For navigation

  const { productId, batchId } = params;

  
  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const packets = await fetchExistingPackets(productId, batchId);
        setExistingPackets(packets);
      } catch (error) {
        console.error("Error fetching existing packets:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPackets();
  }, [productId, batchId]);
  

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Existing Packets Without Refractometer Report
        </h1>
      </div>

      {/* Back Button */}
      <div className="mb-4">
        <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push(`/admin/${productId}/${batchId}/batch_details`)}>
          Back to Batch Details
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-md">
          {/* Table Section */}
          <table className="min-w-full bg-gray-100 rounded-md">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 border">No</th>
                <th className="px-6 py-3 border">Serial Number</th>
              </tr>
            </thead>
            <tbody>
              {existingPackets.length > 0 ? (
                existingPackets.map((packet, index) => (
                  <tr key={packet.id}>
                    <td className="px-6 py-4 border text-center">{index + 1}</td>
                    <td className="px-6 py-4 border text-center">{packet.serialNo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-4 border text-center">
                    No packets found without refractometer report
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExistingPacket;
