/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useGetCategoriesQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../../services/api"; // RTK Query hooks
import Swal from "sweetalert2";
import { ArrowLeft, Save } from "lucide-react";
import Loading from "@/components/atoms/Loading";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for product
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: number;
  image: File | null;
  isPublic: boolean;
}

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [updateProduct] = useUpdateProductMutation();
  const { data: productData, isLoading } = useGetProductByIdQuery(Number(id));

  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: 0,
    image: null,
    isPublic: false,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (productData) {
      setProduct({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price.toString(),
        stock: productData.stock.toString(),
        categoryId: productData.categoryId,
        image: productData.image ? productData.image : null,
        isPublic: productData.isPublic,
      });
    }
  }, [productData]);

  const { data: categories } = useGetCategoriesQuery();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: "" })); // Reset error on change
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log(file);
    setProduct((prev) => ({ ...prev, image: file }));
  };
  console.log(product.image);
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, price, stock, categoryId, image, isPublic } =
      product;

    // Simple validation for empty fields
    const newErrors: any = {};
    if (!name) newErrors.name = "Product name is required";
    if (!description) newErrors.description = "Product description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!image) newErrors.image = "Image is required";

    // Validate price and stock to ensure they are numbers
    if (isNaN(parseFloat(price)))
      newErrors.price = "Price must be a valid number";
    if (isNaN(parseInt(stock, 10)))
      newErrors.stock = "Stock must be a valid number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();

      const evidenceData = image;
      const mimeType = "image/jpeg";

      if (evidenceData) {
        // Pastikan evidenceData tidak null
        // Konversi File ke Blob
        const byteArray = new Uint8Array(await evidenceData.arrayBuffer()); // Menggunakan arrayBuffer()
        const blobImage = new Blob([byteArray], { type: mimeType });
        formData.append("image", blobImage);
      }

      formData.append("name", name);
      formData.append("description", description);
      // formData.append("price", parseFloat(price));
      // formData.append("stock", parseInt(stock, 10));
      formData.append("price", String(price));
      formData.append("stock", String(stock));
      formData.append("categoryId", String(categoryId));
      formData.append("isPublic", String(isPublic));

      setLoading(true);
      await updateProduct({
        id: product.id,
        updatedProduct: formData,
      })
        .unwrap()
        .then(async () => {
          // Display the success alert and wait for the user to click "OK"
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product updated successfully!",
            confirmButtonText: "OK",
          });

          // Redirect only if the user confirms the alert
          if (result.isConfirmed) {
            router.push("/admin/products");
          }
        });
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  if (isLoading || loading) return <Loading />;

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col px-8 pt-4">
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
            <a href="/admin/products" className="hover:font-semibold">
              Products
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Edit Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Edit Information Product</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to update the product.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="image"
                className="text-sm text-gray-600 font-semibold"
              >
                Product Image<span className="text-red-500">*</span>
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md p-2 hover:border-gray-900"
                onChange={handleFileChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm text-gray-600 font-semibold"
              >
                Product Name<span className="text-red-500">*</span>
              </label>
              <Textarea
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name..."
                rows={4}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="description"
                className="text-sm text-gray-600 font-semibold"
              >
                Product Description<span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={product.description || ""}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="description"
                className="text-sm text-gray-600 font-semibold"
              >
                Category<span className="text-red-500">*</span>
              </label>
              <Select
                defaultValue={
                  product.categoryId ? String(product.categoryId) : "-1"
                }
                onValueChange={(value) =>
                  setProduct((prev) => ({ ...prev, categoryId: Number(value) }))
                }
              >
                <SelectTrigger className="w-full mt-2 p-2 border rounded-md text-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="default" value="-1">
                    Select Category
                  </SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {"CAT-" + category.id} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.categoryId}</p>
              )}
            </div>
            <div className="space-y-5">
              <label
                htmlFor="showInCatalog"
                className="text-sm text-gray-600 font-semibold flex items-center justify-between"
              >
                Show in Catalog
                <Switch
                  checked={Boolean(product.isPublic)}
                  onCheckedChange={(checked: any) =>
                    setProduct((prev: any) => ({
                      ...prev,
                      isPublic: checked,
                    }))
                  }
                />
              </label>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="price"
                className="text-sm text-gray-600 font-semibold"
              >
                Price<span className="text-red-500">*</span>
              </label>
              <Input
                id="price"
                name="price"
                type="text"
                value={product.price}
                onChange={handleChange}
                placeholder="0"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="stock"
                className="text-sm text-gray-600 font-semibold"
              >
                Stock<span className="text-red-500">*</span>
              </label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleChange}
                placeholder="0"
                min={0}
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                size="lg"
                className="border-[1px] border-gray-400"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 " />
                Cancel
              </Button>
              <Button type="submit" variant="default" size="lg">
                <Save className="w-5 h-5 " />
                Save Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
