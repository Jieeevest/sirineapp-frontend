"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCreateRoleMutation } from "../../../../services/api";
import { ArrowLeft, Save } from "lucide-react";

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
      await createRole({ name: role.name })
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Role added successfully!",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            router.push("/admin/roles");
          }
        });
    } catch (err) {
      console.error("Failed to create role:", err);
      setError("An error occurred while creating the role.");
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col px-8 pt-4">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-gray-600">
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
          <li className="font-semibold text-gray-800">Add Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add New Role</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to add the role.
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

            <div className="flex justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                size="lg"
                className="border-[1px] border-gray-400"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 " />
                Cancel
              </Button>
              <Button type="submit" variant="default" size="lg">
                <Save className="w-5 h-5 " />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
