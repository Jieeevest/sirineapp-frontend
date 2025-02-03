"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../../../../services/api"; // RTK Query hooks

// Define the type for Category
interface Category {
  id: number;
  name: string;
}

export default function UpdateCategory() {
  const router = useRouter();
  const { id } = useParams(); // Assuming dynamic routing
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
    setCategoryError(""); // Clear error on input change
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
      }).unwrap();
      alert("Category updated successfully!");

      setTimeout(() => {
        router.push("/admin/categories");
      }, 1000);
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
          <li className="font-semibold text-gray-800">Update Category</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Update Category</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Update the category details below
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
