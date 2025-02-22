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
import { useGetUsersQuery, useDeleteUserMutation } from "../../../services/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Users() {
  const router = useRouter();
  const { data: users } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  const handleAddUser = () => {
    router.push("/admin/users/create");
  };

  const handleUpdateUser = (id: number) => {
    router.push(`/admin/users/${id}/update`);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  // Filter users by search term
  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered users
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstItem, indexOfLastItem);

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
    (filteredUsers?.length ? filteredUsers?.length : 0) / itemsPerPage
  );

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-800">
            Users Management
          </h1>
          <Button
            variant="default"
            size="lg"
            className="h-10 gap-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleAddUser}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add User</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-2 mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 border rounded-lg w-full"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage and view users and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[50px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="w-[100px]">User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No users available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentUsers?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell>USER-00{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.updatedAt}</TableCell>
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
                              onClick={() => handleUpdateUser(user.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteUser(user.id)}
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
