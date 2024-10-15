"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CustomerSearch = () => {
  const [serialNo, setSerialNo] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (serialNo.trim() === "") {
      alert("Please enter a serial number.");
      return;
    }

    // Redirect to the search results page with the serial number
    router.push(`/customer/${serialNo}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Customer Search
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2">Enter Serial Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={serialNo}
            onChange={(e) => setSerialNo(e.target.value)}
            placeholder="Enter serial number"
          />
        </div>

        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default CustomerSearch;
