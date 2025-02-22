/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginMutation } from "@/services/authApi";

export default function Login() {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    setLoading(true);

    try {
      // Memanggil mutation login
      const data = await login({ email, password }).unwrap();
      const responseData = data.data;
      // Jika login berhasil, simpan token ke localStorage
      if (responseData.token) {
        const { token, name, email, role } = responseData;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRoleID", role.id.toString());
        localStorage.setItem("userRoleName", role.name);
      }

      alert("Login successful!");
      console.log(data);
      setTimeout(() => {
        router.push("/admin/orders");
      }, 1000);
    } catch (err: any) {
      console.log(err);
      setError("Invalid email or password");
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full transition duration-300"
              />
            </div>

            <div className="space-y-2">
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
                className="border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 w-full transition duration-300"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                {loading ? (
                  <span className="animate-spin">⏳</span> // Menampilkan ikon loading
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
