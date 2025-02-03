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
import { useGetUsersQuery, useDeleteUserMutation } from "../../../services/api"; // Import RTK Query hooks
import { useRouter } from "next/router";

export default function Users() {
  const router = useRouter();
  const { data: users } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

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

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Users Management
          </h1>
        </div>
        <div className="flex">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="lg"
              className="h-7 gap-1 text-sm"
              onClick={() => handleAddUser()}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add User</span>
            </Button>
          </div>
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
                {users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No users available.
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user, index) => (
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
      </main>
    </div>
  );
}
