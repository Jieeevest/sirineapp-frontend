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
import { useEffect, useState } from "react";
import { formatDate } from "@/helpers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Swal from "sweetalert2";

export default function Categories() {
  const router = useRouter();
  const { data: categories, refetch } = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  useEffect(() => {
    refetch();
  }, [categories, refetch]);

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
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete this category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategory(id).then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "You have been successfully delete this category.",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            router.push("/admin/categories");
          }
        });
      } else if (result.isDismissed) {
        console.log("Logout cancelled.");
      }
    });
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
      <main className="flex flex-1 flex-col gap-4 px-8 pt-4">
        <nav className="mb-6 text-sm text-gray-600">
          <ol className="list-none p-0 flex space-x-2">
            <li>
              <a href="/admin/dashboard" className="hover:font-semibold">
                Dashboard
              </a>
            </li>
            <li>&gt;</li>
            <li>
              <a href="/admin/categories" className="hover:font=semibold">
                Categories
              </a>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-gray-800">List Data</li>
          </ol>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-800">
            Categories Management
          </h1>
          <Button
            variant="default"
            size="lg"
            className="h-10 gap-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleAdd}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Category</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 rounded-lg w-full border-[1px] border-gray-300 mt-2 focus:outline-none focus:border-gray-800"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full shadow-sm border-[1px] border-gray-300">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
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
                  <TableHead>Description</TableHead>
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
                        {itemsPerPage * (currentPage - 1) + index + 1}
                      </TableCell>
                      <TableCell>{`CATEGORY-00${category.id}`}</TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.description || "-"}</TableCell>
                      <TableCell>{formatDate(category.createdAt)}</TableCell>
                      <TableCell>{formatDate(category.updatedAt)}</TableCell>
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
          <Pagination className="mt-4 cursor-pointer">
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
