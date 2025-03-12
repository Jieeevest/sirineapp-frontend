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
import { useGetRolesQuery, useDeleteRoleMutation } from "../../../services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { formatDate } from "@/helpers";

export default function Roles() {
  const router = useRouter();
  const { data: roles } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  const handleAddRole = () => {
    router.push("/admin/roles/create");
  };

  const handleUpdateRole = (id: number) => {
    router.push(`/admin/roles/${id}/update`);
  };

  const handleDeleteRole = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id);
      } catch (err) {
        console.error("Failed to delete role:", err);
      }
    }
  };

  // Filter roles by search term
  const filteredRoles = roles?.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered roles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = filteredRoles?.slice(indexOfFirstItem, indexOfLastItem);

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
    (filteredRoles?.length ? filteredRoles?.length : 0) / itemsPerPage
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
              <a href="/admin/roles" className="hover:font=semibold">
                Roles
              </a>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-gray-800">List Data</li>
          </ol>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-800">
            Role Management
          </h1>
          <Button
            variant="default"
            size="lg"
            className="h-10 gap-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleAddRole}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Role</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search Roles..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 rounded-lg w-full border-[1px] border-gray-300 mt-2 focus:outline-none focus:border-gray-800"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full shadow-sm border-[1px] border-gray-300 rounded-xl bg-white">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Manage and view roles and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[50px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="w-[100px]">Role ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRoles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No roles available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRoles?.map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell className="hidden sm:table-cell">
                        {itemsPerPage * (currentPage - 1) + index + 1}
                      </TableCell>
                      <TableCell>ROLE-00{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{formatDate(role.createdAt)}</TableCell>
                      <TableCell>{formatDate(role.updatedAt)}</TableCell>
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
                              onClick={() => handleUpdateRole(role.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteRole(role.id)}
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
