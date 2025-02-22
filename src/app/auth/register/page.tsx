/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Simulate registration
      alert("Registration successful!");
      setTimeout(() => {
        router.push("/admin/orders");
      }, 1000);
    } catch (err: any) {
      console.log(err);
      setError("An error occurred during registration");
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
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className={`border-2 p-3 w-full rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && !name ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`border-2 p-3 w-full rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && !email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={`border-2 p-3 w-full rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && !password ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`border-2 p-3 w-full rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && !confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
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
