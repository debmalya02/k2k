"use client";

import React, { useEffect, useState } from "react";
import { fetchCustomerDetails } from "../../../../firebase/firebaseUtil";
import { useRouter } from "next/navigation";

interface PacketDetails {
  productName: string;
  productDetails: string;
  productImage: string;
  batchNo: string;
  testReport: string;
  refractometerReport: string;
}

const SearchResult = ({ params }: { params: { serialNo: string } }) => {
  const [packetDetails, setPacketDetails] = useState<PacketDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { serialNo } = params;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchCustomerDetails(serialNo);
        if (details) {
          setPacketDetails(details);
        } else {
          alert("No details found for the given serial number.");
          router.push("/customer");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        router.push("/customer");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [serialNo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl font-bold text-gray-800 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Left: Product Image */}
        <div className="">
          <img
            src={packetDetails?.productImage}
            alt={packetDetails?.productName}
            className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col ">
          <div>
            {/* Product Name */}
            <h1 className="text-4xl font-semibold mb-4 text-gray-800">
              {packetDetails?.productName}
            </h1>

            {/* Product Details */}
            <p className="text-gray-600 mb-6">{packetDetails?.productDetails}</p>

            {/* Product Information */}
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-700 mb-2">
                <strong>Batch No:</strong> {packetDetails?.batchNo}
              </p>
              <p className="text-lg font-medium text-gray-700 mb-2">
                <strong>Refractometer Report:</strong>{" "}
                {packetDetails?.refractometerReport || "Not available"}
              </p>
            </div>

            {/* Test Report Link */}
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-700">
                <strong>Test Report:</strong>{" "}
                {packetDetails?.testReport ? (
                  <a
                    href={packetDetails.testReport}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noopener noreferrer"
                  >
                    View Report
                  </a>
                ) : (
                  "Not available"
                )}
              </p>
            </div>
          </div>

          {/* Bottom: Actions */}
          <div className="mt-6">
            
            <button
              onClick={() => router.push("/customer")}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
