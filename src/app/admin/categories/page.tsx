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
import { useState } from "react";

export default function Categories() {
  const router = useRouter();
  const { data: categories } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  // Handle adding a new category
  const handleAdd = () => {
    router.push("/admin/categories/create");
  };

  // Handle updating a category
  const handleUpdate = (id: number) => {
    router.push(`/admin/categories/${id}/update`);
  };

  // Handle deleting a category
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

  // Filter categories by search term
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered categories
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    (filteredCategories?.length ? filteredCategories?.length : 0) / itemsPerPage
  );

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-2 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-800">
            Categories Management
          </h1>
          <Button
            variant="default"
            size="lg"
            className="h-10 gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleAdd}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-2 mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 border rounded-lg w-full"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full shadow-md rounded-xl bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Categories
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage and view categories and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">#</TableHead>
                  <TableHead className="w-[150px]">Category ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      <div>
                        <span className="block mb-4">
                          No categories available.
                        </span>
                        <span className="block">
                          Please add a category to get started.
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCategories?.map((category, index) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-gray-100 transition duration-300"
                    >
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{`CATEGORY-00${category.id}`}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.createdAt}</TableCell>
                      <TableCell>{category.updatedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-blue-100"
                              onClick={() => handleUpdate(category.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-500 hover:bg-red-100"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } px-4 py-2 rounded-md text-sm`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
