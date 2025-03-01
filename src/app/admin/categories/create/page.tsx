"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import { useCreateCategoryMutation } from "../../../../services/api"; // RTK Query hooks
import Swal from "sweetalert2";
// Define the type for Category
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
      error: "", // Clear error on input change
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formState.category.name.trim()) {
      setFormState((prevState) => ({
        ...prevState,
        error: "Category name is required",
      }));
      return;
    }

    // Set submitting state
    setFormState((prevState) => ({
      ...prevState,
      isSubmitting: true,
    }));

    try {
      await createCategory({ name: formState.category.name })
        .unwrap()
        .then(async () => {
          // Display the success alert and wait for the user to click "OK"
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Add Category successfully!",
            confirmButtonText: "OK",
          });

          // Redirect only if the user confirms the alert
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

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={formState.isSubmitting} // Disable button while submitting
              >
                {formState.isSubmitting ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
