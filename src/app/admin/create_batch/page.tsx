"use client";

import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

interface Product {
  name: string;
}

export default function CreateBatch({ products = [], onCreateBatch }: { products?: Product[], onCreateBatch: (batchData: any) => void }) {
  const handleCreateBatch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const batchNumber = form.batchNumber.value;
    const quantityLimit = parseInt(form.quantityLimit.value);
    const testReport = (form.testReport as HTMLInputElement).files?.[0];

    onCreateBatch({
      batchNumber,
      product: form.productSelect.value,
      quantityLimit,
      currentQuantity: 0,
      testReport: testReport ? URL.createObjectURL(testReport) : null,
    });
    form.reset();
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create Batch</h2>
      <form onSubmit={handleCreateBatch} className="space-y-4">
        <div>
          <Label htmlFor="productSelect">Select Product</Label>
          <Select name="productSelect" required>
            <option value="">Select a product</option>
            {products.length > 0 ? (
              products.map((product, index) => (
                <option key={index} value={product.name}>
                  {product.name}
                </option>
              ))
            ) : (
              <option disabled>No products available</option>
            )}
          </Select>
        </div>
        <div>
          <Label htmlFor="batchNumber">Batch Number</Label>
          <Input id="batchNumber" name="batchNumber" required />
        </div>
        <div>
          <Label htmlFor="quantityLimit">Quantity Limit</Label>
          <Input id="quantityLimit" name="quantityLimit" type="number" required />
        </div>
        <div>
          <Label htmlFor="testReport">Test Report</Label>
          <Input id="testReport" name="testReport" type="file" accept=".pdf,.doc,.docx" />
        </div>
        <Button type="submit">Create Batch</Button>
      </form>
    </section>
  );
}
