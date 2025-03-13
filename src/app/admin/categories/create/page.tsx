/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCreateCategoryMutation } from "../../../../services/api";
import { ArrowLeft, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
interface Category {
  name: string;
  description: string;
}

export default function AddCategory() {
  const router = useRouter();
  const [payload, setPayload] = useState<Category>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({
    name: "",
    description: "",
  });
  const [createCategory] = useCreateCategoryMutation();

  const handleChange = (key: string, value: any) => {
    setPayload({
      ...payload,
      [key]: value,
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description } = payload;

    // Simple validation for empty fields
    const newErrors: {
      name?: string;
      description?: string;
    } = {};
    if (!name) newErrors.name = "Category name is required";
    if (!description)
      newErrors.description = "Category description is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // If there are errors, do not submit

    const objectPayload = {
      name,
      description,
    };

    try {
      await createCategory(objectPayload)
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Add Category successfully!",
            confirmButtonText: "OK",
          });

          if (result.isConfirmed) {
            router.push("/admin/categories");
          }
        });
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col px-8 pt-4">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/categories" className="hover:text-blue-600">
              Categories
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Add Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add New Category</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to add the category.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={payload.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter category name"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
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
                Category Description<span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={payload.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter category description..."
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
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
