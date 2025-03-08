"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Swal from "sweetalert2";
import { ArrowLeft, Save } from "lucide-react";

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
  evidence: File | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = {
    name: localStorage?.getItem("userName"),
    email: localStorage?.getItem("userEmail"),
    role: localStorage?.getItem("userRoleName"),
    avatar: "/avatars/shadcn.jpg",
  };
  const [checkoutData, setCheckoutData] = useState<CheckoutForm>({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    paymentMethod: "",
    evidence: null,
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
        router.push("/customer/orders");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCheckoutData((prev) => ({ ...prev, evidence: file }));
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <Card className="w-full max-w-full">
        <CardHeader>
          <p className="border-b-2 border-gray-200 pb-4 text-sm text-gray-500">
            Please fill in the form below to complete your purchase.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-4">
            <div className="w-1/2 px-8 py-4 border-[1px] rounded-md shadow-sm border-gray-300">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            </div>
            <div className="w-1/2 px-8 py-4 border-[1px] rounded-md shadow-sm border-gray-300">
              <h2 className="text-lg font-semibold mb-4">
                Payment Information
              </h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={checkoutData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled
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
                    disabled
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
                  <label
                    htmlFor="paymentMethod"
                    className="text-sm font-normal"
                  >
                    Please transfer the amount to the following account: <br />
                    <span className="font-semibold">
                      BANK CENTRAL ASIA (BCA) 1234567890 a/n Sirine App. <br />
                      Rp. {0}. <br />
                    </span>
                    Please include your name in the memo and upload evidence of
                    the transfer below.
                  </label>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="paymentMethod"
                    className="text-sm font-medium"
                  >
                    Evidence
                  </label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md p-2 hover:border-gray-900"
                    onChange={handleFileChange}
                  />
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
                    Confirm Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
