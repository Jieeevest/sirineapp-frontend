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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
