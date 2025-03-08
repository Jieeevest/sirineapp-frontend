"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCreateCategoryMutation } from "../../../../services/api";
import { ArrowLeft, Save } from "lucide-react";
interface Category {
  name: string;
}

interface FormState {
  category: Category;
  error: string;
  isSubmitting: boolean;
}

const initialState: FormState = {
  category: { name: "" },
  error: "",
  isSubmitting: false,
};

export default function AddCategory() {
  const router = useRouter();
  const [createCategory] = useCreateCategoryMutation();
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      category: { name: e.target.value },
      error: "",
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.category.name.trim()) {
      setFormState((prevState) => ({
        ...prevState,
        error: "Category name is required",
      }));
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      isSubmitting: true,
    }));

    try {
      await createCategory({ name: formState.category.name })
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
      setFormState((prevState) => ({
        ...prevState,
        error: "An error occurred while creating the category.",
        isSubmitting: false,
      }));
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col p-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/admin/dashboard" className="hover:font-semibold">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/admin/categories" className="hover:font-semibold">
              Categories
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Add</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add Category</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-500">
            Please fill in the form below to add the category.
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
                value={formState.category.name}
                onChange={handleChange}
                placeholder="Enter category name"
                disabled={formState.isSubmitting} // Disable input while submitting
              />
              {formState.error && (
                <p className="text-red-500 text-sm">{formState.error}</p>
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
