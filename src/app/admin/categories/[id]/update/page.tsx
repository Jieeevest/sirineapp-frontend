"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../../../services/api";
import { ArrowLeft, Save } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function UpdateCategory() {
  const router = useRouter();
  const { id } = useParams();
  const [updateCategory] = useUpdateCategoryMutation();
  const {
    data: categoryData,
    isLoading,
    error,
  } = useGetCategoryByIdQuery(Number(id));

  const [category, setCategory] = useState<Category>({ id: 0, name: "" });
  const [categoryError, setCategoryError] = useState<string>("");

  useEffect(() => {
    if (categoryData) {
      setCategory({
        id: categoryData.id,
        name: categoryData.name,
      });
    }
  }, [categoryData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, name: e.target.value });
    setCategoryError("");
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name) {
      setCategoryError("Category name is required");
      return;
    }

    try {
      await updateCategory({
        id: category.id,
        updatedCategory: { name: category.name },
      })
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
      console.error("Failed to update category:", err);
      setCategoryError("An error occurred while updating the category.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching category details!</p>;

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col p-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/admin/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/admin/categories" className="hover:text-blue-600">
              Categories
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Edit</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Edit Information Category</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-500">
            Please fill in the form below to update the category.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="name"
                name="name"
                value={category.name}
                onChange={handleChange}
                placeholder="Enter category name"
              />
              {categoryError && (
                <p className="text-red-500 text-sm">{categoryError}</p>
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
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
