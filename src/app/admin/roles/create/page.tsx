"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import { useCreateRoleMutation } from "../../../../services/api"; // RTK Query hooks

// Define the type for the role
interface Role {
  name: string;
}

export default function AddRole() {
  const router = useRouter();
  const [createRole] = useCreateRoleMutation();
  const [role, setRole] = useState<Role>({ name: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole({ name: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role.name) {
      setError("Role name is required");
      return;
    }

    try {
      await createRole({ name: role.name }).unwrap();

      alert("Role created successfully!");
      setTimeout(() => {
        router.push("/admin/roles");
      }, 1000);
    } catch (err) {
      console.error("Failed to create role:", err);
      setError("An error occurred while creating the role.");
    }
  };

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
          <li className="font-semibold text-gray-800">Add Role</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add Role</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Add a new role
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRole} className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg">
                Add Role
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
