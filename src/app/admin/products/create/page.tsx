"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import { useCreateProductMutation } from "../../../../services/api"; // RTK Query mutation
import Swal from "sweetalert2";

// Define types for product
interface Product {
  name: string;
  description: string;
  price: string;
  stock: string;
}

export default function AddProduct() {
  const router = useRouter();
  const [createProduct] = useCreateProductMutation();
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [errors, setErrors] = useState<Partial<Product>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Reset error on change
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, price, stock } = product;

    // Simple validation for empty fields
    const newErrors: Partial<Product> = {};
    if (!name) newErrors.name = "Product name is required";
    if (!description) newErrors.description = "Product description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // If there are errors, do not submit

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
    };

    try {
      await createProduct(newProduct)
        .unwrap()
        .then(async () => {
          // Display the success alert and wait for the user to click "OK"
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product added successfully!",
            confirmButtonText: "OK",
          });

          // Redirect only if the user confirms the alert
          if (result.isConfirmed) {
            router.push("/admin/products");
          }
        });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col p-4">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/admin/dashboard" className="hover:font-semibold">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/admin/products" className="hover:font=semibold">
              Products
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Add</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-500">
            Please fill in the form below to add the product.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <Textarea
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                rows={4}
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
                rows={4}
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
                Save Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
