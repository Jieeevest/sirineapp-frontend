"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{ email: string }>({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: email ? "" : "Email is required",
    };

    setError(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("test");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-xl bg-white p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary mb-4">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address<span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-[1px] border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-5 w-full transition duration-300"
              />
              {error && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full py-5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                {loading ? <span className="animate-spin">⏳</span> : "Login"}
              </Button>
            </div>
          </form>

          <div className="flex justify-between text-sm mt-4">
            <Link
              href="/auth/login"
              className="text-black hover:text-gray-700 hover:underline hover:underline-offset-2"
            >
              Sign In?
            </Link>
            <Link
              href="/auth/register"
              className="text-black hover:text-gray-700 hover:underline hover:underline-offset-2"
            >
              Don&apos;t have an account? Register
            </Link>
          </div>
          <div className="mt-4 text-center ">
            <Link
              href="/"
              className="text-black hover:text-gray-700 flex items-center justify-center hover:font-semibold"
            >
              <span className="mr-2 text-xl">&#8592;</span>
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
