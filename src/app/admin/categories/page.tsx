"use client";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../../services/api"; // Import RTK Query hooks
import { useRouter } from "next/navigation";

export default function Categories() {
  const router = useRouter();

  const { data: categories } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleAdd = () => {
    router.push("/admin/categories/create");
  };
  const handleUpdate = (id: number) => {
    router.push(`/admin/categories/${id}/update`);
  };
  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        alert("Category deleted successfully!");

        setTimeout(() => {
          router.push("/admin/categories");
        }, 500);
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Categories Management
          </h1>
        </div>
        <div className="flex">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="lg"
              className="h-7 gap-1 text-sm"
              onClick={() => handleAdd()}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Category</span>
            </Button>
          </div>
        </div>

        {/* Data Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage and view categories and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[50px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="w-[100px]">Category ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No categories available.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories?.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="w-[200px]">
                        CATEGORY-00{category.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.createdAt}</TableCell>
                      <TableCell>{category.updatedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleUpdate(category.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
