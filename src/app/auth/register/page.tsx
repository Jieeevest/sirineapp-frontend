/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const router = useRouter();
  const [payload, setPayload] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (property: string, value: string) => {
    setPayload((prev) => ({ ...prev, [property]: value }));
    setError((prev) => ({ ...prev, [property]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      fullName: payload.fullName ? "" : "Full name is required",
      email: payload.email ? "" : "Email is required",
      password: payload.password ? "" : "Password is required",
      confirmPassword: payload.confirmPassword
        ? ""
        : "Confirm password is required",
    };
    setError(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      // Simulate registration
      alert("Registration successful!");
      setTimeout(() => {
        router.push("/admin/orders");
      }, 1000);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-6">
      <Card className="w-full max-w-lg shadow-2xl rounded-xl bg-white p-8">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold text-center text-primary mb-4">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            {/* Reduced the gap here */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name<span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                value={payload.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {error && (
                <p className="text-red-500 text-sm">{error.fullName}</p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address<span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={payload.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {error && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                value={payload.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter your password"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {error && (
                <p className="text-red-500 text-sm">{error.password}</p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={payload.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm your password"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {error && (
                <p className="text-red-500 text-sm">{error.confirmPassword}</p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
              >
                {loading ? (
                  <span className="animate-spin">⏳</span> // Displaying loading icon
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
