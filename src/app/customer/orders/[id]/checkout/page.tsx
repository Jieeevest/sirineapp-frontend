"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Swal from "sweetalert2";

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutForm>({
    name: "",
    email: "",
    address: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, address, paymentMethod } = checkoutData;

    const newErrors: Partial<CheckoutForm> = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!address) newErrors.address = "Address is required";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const result = await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Checkout completed successfully!",
        confirmButtonText: "OK",
      });

      if (result.isConfirmed) {
        router.push("/thank-you");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-500">
            Please fill in the form below to complete your purchase.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={checkoutData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={checkoutData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Textarea
                id="address"
                name="address"
                value={checkoutData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="paymentMethod" className="text-sm font-medium">
                Payment Method
              </label>
              <Input
                id="paymentMethod"
                name="paymentMethod"
                value={checkoutData.paymentMethod}
                onChange={handleChange}
                placeholder="Enter payment method (e.g., Credit Card, PayPal)"
              />
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" size="lg">
                Confirm Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
