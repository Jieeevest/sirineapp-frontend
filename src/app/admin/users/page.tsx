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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { formatDate } from "@/helpers";
import Swal from "sweetalert2";
import Loading from "@/components/atoms/Loading";

export default function Users() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: users, refetch, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  useEffect(() => {
    refetch();
  }, [users, refetch]);

  const handleAddUser = () => {
    setLoading(true);
    router.push("/admin/users/create");
  };

  const handleUpdateUser = (id: number) => {
    setLoading(true);
    router.push(`/admin/users/${id}/update`);
  };

  const handleDeleteUser = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await deleteUser(id).then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "You have been successfully delete this user.",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            setLoading(false);
            refetch();
          }
        });
      } else if (result.isDismissed) {
        setLoading(false);
        console.log("Delete cancelled.");
      }
    });
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

  if (loading || isLoading) return <Loading />;
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
            className="h-10 gap-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
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
            className="p-3 rounded-lg w-full border-[1px] border-gray-300 mt-2 focus:outline-none focus:border-gray-800"
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
                  <TableHead>Role Name</TableHead>
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
                        {itemsPerPage * (currentPage - 1) + index + 1}
                      </TableCell>
                      <TableCell>USER-00{user.id}</TableCell>
                      <TableCell className="font-medium">
                        {user.name || "-"}
                      </TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user?.roles?.name || "-"}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
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
