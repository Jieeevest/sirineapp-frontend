/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
} from "../../../../services/api"; // RTK Query mutation
import Swal from "sweetalert2";
import { ArrowLeft, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/atoms/Loading";

// Define types for product
interface Product {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: number;
  image: File | null;
  isPublic: boolean;
}

export default function AddProduct() {
  const router = useRouter();
  const [createProduct] = useCreateProductMutation();
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: 0,
    image: null,
    isPublic: false,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
    image?: string;
    category?: string;
  }>({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const { data: categories, isLoading } = useGetCategoriesQuery();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      let newValue = value;

      // Format khusus jika input adalah "price"
      if (name === "price" || name === "stock") {
        const rawValue = value.replace(/\D/g, ""); // Hanya angka
        newValue = rawValue
          ? new Intl.NumberFormat("id-ID").format(Number(rawValue))
          : "";
      }

      return { ...prev, [name]: newValue };
    });

    setErrors((prev) => ({ ...prev, [name]: "" })); // Reset error saat input berubah
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, price, stock, image, categoryId, isPublic } =
      product;

    // Simple validation for empty fields
    const newErrors: {
      name?: string;
      description?: string;
      price?: string;
      stock?: string;
      image?: string;
      category?: string;
    } = {};
    if (!name) newErrors.name = "Product name is required";
    if (!description) newErrors.description = "Product description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";
    if (!image) newErrors.image = "Image is required";
    if (!categoryId) newErrors.category = "Category is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();

      const evidenceData = image; // Data dari database (object number)
      const mimeType = "image/jpeg"; // Sesuaikan dengan tipe gambar

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
      await createProduct(formData)
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
            setLoading(false);
            router.push("/admin/products");
          }
        });
    } catch (error) {
      setLoading(false);
      console.error("Failed to add product:", error);
    }
  };

  if (loading || isLoading) return <Loading />;

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
            <a href="/admin/products" className="hover:font=semibold">
              Products
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Add Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl shadow-sm border-[1px] border-gray-300">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to add the product.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
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
                // className="border border-gray-300 rounded-md p-2 hover:border-gray-900"
                onChange={handleFileChange}
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 h-10 w-full transition duration-300 hover:cursor-pointer hover:shadow-md hover:border-gray-900"
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
                value={product.description}
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
                value={product.categoryId ? String(product.categoryId) : "-1"} // Gunakan "-1" sebagai nilai default
                onValueChange={(value) =>
                  setProduct((prev) => ({ ...prev, categoryId: Number(value) }))
                }
              >
                <SelectTrigger className="w-full mt-2 p-5 border rounded-md text-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="default" value="-1">
                    Select Category
                  </SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>
            <div className="space-y-5">
              <label
                htmlFor="description"
                className="text-sm text-gray-600 font-semibold flex items-center justify-between"
              >
                Show in Catalog <span className="text-red-500">*</span>
                <Switch
                  id="description"
                  name="description"
                  checked={Boolean(product.isPublic)}
                  onCheckedChange={(checked: any) =>
                    setProduct((prev: any) => ({
                      ...prev,
                      isPublic: checked ? "true" : "false",
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
