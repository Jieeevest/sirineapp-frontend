"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../../../../services/api"; // RTK Query hooks

// Define the type for the role
interface Role {
  id: number;
  name: string;
}

export default function UpdateRole() {
  const router = useRouter();
  const { id } = useParams(); // Assuming dynamic routing
  const [updateRole] = useUpdateRoleMutation();
  const { data: roleData, isLoading } = useGetRoleByIdQuery(Number(id));

  const [role, setRole] = useState<Role>({ id: 0, name: "" });
  const [roleError, setRoleError] = useState<string>("");

  useEffect(() => {
    if (roleData) {
      setRole({
        id: roleData.id,
        name: roleData.name,
      });
    }
  }, [roleData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ ...role, name: e.target.value });
    setRoleError(""); // Clear error on input change
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role.name) {
      setRoleError("Role name is required");
      return;
    }

    try {
      await updateRole({
        id: role.id,
        updatedRole: { name: role.name },
      }).unwrap();
      alert("Role updated successfully!");
      setTimeout(() => {
        router.push("/admin/roles");
      }, 1000);
    } catch (err) {
      console.error("Failed to update role:", err);
      setRoleError("An error occurred while updating the role.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col p-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-600">
        <ol className="list-none p-0 flex space-x-2">
          <li>
            <a href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>&gt;</li>
          <li>
            <a href="/roles" className="hover:text-blue-600">
              Roles
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Update Role</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Update Role</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Update the role details below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Role Name
              </label>
              <Input
                id="name"
                name="name"
                value={role.name}
                onChange={handleChange}
                placeholder="Enter role name"
              />
              {roleError && <p className="text-red-500 text-sm">{roleError}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
