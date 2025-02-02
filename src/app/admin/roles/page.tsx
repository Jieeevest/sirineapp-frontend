"use client";
import { useState } from "react";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";
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
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
} from "../../../services/api"; // Import RTK Query hooks

export default function Roles() {
  const [showFilter, setShowFilter] = useState(false);
  const [roleName, setRoleName] = useState(""); // To manage input for new role

  const { data: roles } = useGetRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const toggleFilterCard = () => {
    setShowFilter(!showFilter);
  };

  const handleCreateRole = async () => {
    if (roleName) {
      await createRole({ name: roleName });
      setRoleName(""); // Reset the input after creation
    }
  };

  const handleDeleteRole = async (id: number) => {
    await deleteRole(id);
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Roles Management
          </h1>
        </div>
        <div className="flex">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="lg"
              className="h-7 gap-1 text-sm"
              onClick={toggleFilterCard}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Role</span>
            </Button>
            <Button size="lg" variant="default" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>

        {/* Filter / Add Role Card */}
        {showFilter && (
          <Card className="w-full mb-4">
            <CardHeader>
              <CardTitle>Add New Role</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Role Name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
              <Button
                variant="default"
                size="lg"
                className="mt-4"
                onClick={handleCreateRole}
              >
                Add Role
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Data Table Card */}
        <Card className="w-full">
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
                {roles?.map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell className="hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell>{role.id}</TableCell>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.createdAt}</TableCell>
                    <TableCell>{role.updatedAt}</TableCell>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
