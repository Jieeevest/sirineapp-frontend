"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../../services/api"; // RTK Query hooks

// Define types for product
interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  stock: string;
}

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [updateProduct] = useUpdateProductMutation();

  // Use the new useGetProductByIdQuery hook
  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductByIdQuery(Number(id));

  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [errors, setErrors] = useState<Partial<Product>>({});

  useEffect(() => {
    if (productData) {
      setProduct({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price.toString(),
        stock: productData.stock.toString(),
      });
    }
  }, [productData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Reset error on change
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, price, stock } = product;

    // Simple validation for empty fields
    const newErrors: Partial<Product> = {};
    if (!name) newErrors.name = "Product name is required";
    if (!description) newErrors.description = "Product description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";

    // Validate price and stock to ensure they are numbers
    if (isNaN(parseFloat(price)))
      newErrors.price = "Price must be a valid number";
    if (isNaN(parseInt(stock, 10)))
      newErrors.stock = "Stock must be a valid number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // If there are errors, do not submit

    const updatedProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };

    try {
      await updateProduct({
        id: product.id,
        updatedProduct: { ...updatedProduct },
      }).unwrap();
      router.push("/products"); // Redirect to Products page after update
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  //   if (error) return <p>Error fetching product details!</p>;

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col p-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/products" className="hover:text-blue-600">
              Products
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Update Product</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Update Product</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Update the product details below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="text-sm font-medium">
                Product Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="price" className="text-sm font-medium">
                Price
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="stock" className="text-sm font-medium">
                Stock
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
