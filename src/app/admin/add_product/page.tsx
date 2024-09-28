"use client";

import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AddProduct({ onAddProduct }: { onAddProduct: (name: string, description: string) => void }) {
  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.productName.value;
    const description = form.productDescription.value;
    
    onAddProduct(name, description);
    form.reset();
  };

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input id="productName" name="productName" required />
        </div>
        <div>
          <Label htmlFor="productDescription">Product Description</Label>
          <Textarea id="productDescription" name="productDescription" required />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </section>
  );
}
