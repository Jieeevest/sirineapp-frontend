"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../services/api";
import { ArrowLeft, Save } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

export default function UpdateUser() {
  const router = useRouter();
  const { id } = useParams();
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
    setUserError("");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user.name || !user.email) {
      setUserError("All fields are required");
      return;
    }

    try {
      await updateUser({ id: user.id, updatedUser: { ...user } })
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User updated successfully!",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            router.push("/users");
          }
        });
      router.push("/users");
    } catch (err) {
      console.error("Failed to update user:", err);
      setUserError("An error occurred while updating the user.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

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
          <li className="font-semibold text-gray-800">Edit Data</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-semibold mb-4">Edit Information User</h1>

      {/* Card Wrapper */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-600 font-semibold">
            Please fill in the form below to update the user.
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
