"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useCreateUserMutation,
  useGetRolesQuery,
} from "../../../../services/api"; // RTK Query hooks
import { ArrowLeft, Save } from "lucide-react";

// Define the type for User
interface User {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export default function AddUser() {
  const router = useRouter();
  const [createUser] = useCreateUserMutation();
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRolesQuery(); // Fetch roles
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    roleId: 1, // Default roleId, assuming '1' is a valid role ID
  });
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!user.name || !user.email || !user.password) {
      setError("All fields are required");
      return;
    }

    try {
      await createUser(user)
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User added successfully!",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            router.push("/admin/users");
          }
        });
    } catch (err) {
      console.error("Failed to create user:", err);
      setError("An error occurred while creating the user.");
    }
  };

  // Error handling if roles fail to load
  if (rolesError) {
    console.error("Failed to fetch roles:", rolesError);
    setError("Failed to load roles.");
  }

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
            <a href="/users" className="hover:text-blue-600">
              Users
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Add Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Add New User</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to add the user.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter user name"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email<span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter user email"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password<span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label htmlFor="roleId" className="text-sm font-medium">
                Role<span className="text-red-500">*</span>
              </label>
              {rolesLoading ? (
                <p>Loading roles...</p>
              ) : (
                <select
                  id="roleId"
                  name="roleId"
                  value={user.roleId}
                  onChange={handleChange}
                  className="block w-full mt-2 p-3 border rounded-md text-sm"
                >
                  <option value="">Select Role</option>
                  {roles &&
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

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
                Save Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
