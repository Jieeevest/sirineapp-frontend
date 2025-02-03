"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import { useCreateCategoryMutation } from "../../../../services/api"; // RTK Query hooks

// Define the type for Category
interface Category {
  name: string;
}

export default function AddCategory() {
  const router = useRouter();
  const [createCategory] = useCreateCategoryMutation();
  const [category, setCategory] = useState<Category>({ name: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({ name: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.name) {
      setError("Category name is required");
      return;
    }

    try {
      await createCategory({ name: category.name }).unwrap();

      alert("Category created successfully!");

      setTimeout(() => {
        router.push("/admin/categories");
      }, 1000);
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("An error occurred while creating the category.");
    }
  };

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
          <li className="font-semibold text-gray-800">Add Category</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add Category</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Add a new category
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg">
                Add Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
