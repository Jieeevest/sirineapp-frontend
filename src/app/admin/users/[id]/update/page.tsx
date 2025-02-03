"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ShadCN UI
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN UI
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../services/api"; // RTK Query hooks

// Define the type for User
interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

export default function UpdateUser() {
  const router = useRouter();
  const { id } = useParams(); // Assuming dynamic routing
  const [updateUser] = useUpdateUserMutation();
  const { data: userData, isLoading } = useGetUserByIdQuery(Number(id));

  const [user, setUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    roleId: 1,
  });
  const [userError, setUserError] = useState<string>("");

  useEffect(() => {
    if (userData) {
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setUserError(""); // Clear error on input change
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.name || !user.email) {
      setUserError("All fields are required");
      return;
    }

    try {
      await updateUser({ id: user.id, updatedUser: { ...user } }).unwrap();
      router.push("/users"); // Redirect to Users page after updating the user
    } catch (err) {
      console.error("Failed to update user:", err);
      setUserError("An error occurred while updating the user.");
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
            <a href="/users" className="hover:text-blue-600">
              Users
            </a>
          </li>
          <li>&gt;</li>
          <li className="font-semibold text-gray-800">Update User</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Update User</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="font-semibold border-b-2 border-gray-200 pb-4">
            Update the user details below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter user name"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter user email"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="roleId" className="text-sm font-medium">
                Role ID
              </label>
              <Input
                id="roleId"
                name="roleId"
                type="number"
                value={user.roleId}
                onChange={handleChange}
                placeholder="Enter role ID"
              />
            </div>

            {userError && <p className="text-red-500 text-sm">{userError}</p>}

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
