/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Check,
  Download,
  MessageCircle,
  Save,
  Star,
} from "lucide-react";
import {
  useGetOrderByIdQuery,
  useReviewOrderMutation,
  useUpdateOrderMutation,
} from "@/services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = useParams(); // Assuming dynamic routing
  const user = {
    name: localStorage?.getItem("userName"),
    email: localStorage?.getItem("userEmail"),
    role: localStorage?.getItem("userRoleName"),
    avatar: "/avatars/shadcn.jpg",
  };

  const [checkout] = useUpdateOrderMutation();
  const [review] = useReviewOrderMutation();
  const [orderItems, setOrderItems] = useState<any>([]);
  const [checkoutData, setCheckoutData] = useState<any>({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    paymentMethod: "",
    evidence: null,
    receipt: null,
    status: "",
  });

  const [hovered, setHovered] = useState(0);

  const [reviewData, setReviewData] = useState<any>({
    rating: 0,
    isReviewed: false,
    comments: "",
  });

  const [errors, setErrors] = useState<{
    address: string;
    evidence: string;
  }>({
    address: "",
    evidence: "",
  });

  const { data, refetch } = useGetOrderByIdQuery(Number(id));

  useEffect(() => {
    if (data) {
      setCheckoutData({
        name: data.order.user.name || "",
        email: data.order.user.email || "",
        address: data.order.address || "",
        status: data.order.status || "",
        evidence: data.order.evidence || "",
        receipt: data.order.receipt || "",
      });
      setReviewData({
        rating: data.order.rating || 0,
        isReviewed: data.order.isReviewed || false,
        comments: data.order.comments || "",
      });
      setOrderItems(data.orderItems || []);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangeReview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReviewData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, address } = checkoutData;

    const newErrors: any = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!address) newErrors.address = "Address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("address", checkoutData.address);
      formData.append("status", "paid");

      // Pastikan evidence bukan null sebelum ditambahkan ke FormData
      if (checkoutData.evidence instanceof File) {
        formData.append("evidence", checkoutData.evidence);
      } else {
        console.error("Invalid file type!");
        return;
      }

      await checkout({ id: Number(id), updatedOrder: formData })
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Checkout completed successfully!",
            confirmButtonText: "OK",
          });

          if (result.isConfirmed) {
            router.push("/customer/orders");
          }
        });
      refetch();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();

    const { rating, comments } = reviewData;

    try {
      review({ id: Number(id), rating, comments })
        .unwrap()
        .then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Review submitted successfully!",
            confirmButtonText: "OK",
          });

          if (result.isConfirmed) {
            router.push("/customer/orders");
          }
        });
      refetch();
    } catch (error) {
      console.error("Review failed:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.warn("No file selected");
      return;
    }

    const file = e.target.files[0];

    setCheckoutData((prev: any) => {
      const newData = { ...prev, evidence: file };
      return newData;
    });
  };

  const handleDownload = () => {
    const evidenceData = checkoutData.evidence; // Data dari database (object number)
    const mimeType = "image/jpeg"; // Sesuaikan dengan tipe gambar

    if (evidenceData && Object.keys(evidenceData).length > 0) {
      // Konversi object number ke Uint8Array
      const byteArray = new Uint8Array(Object.values(evidenceData));
      const blob = new Blob([byteArray], { type: mimeType });

      // Buat URL Blob untuk unduhan
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "downloaded-image.jpg"; // Sesuaikan dengan nama file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hapus URL dari memori setelah digunakan
      URL.revokeObjectURL(blobUrl);
    } else {
      console.error("Invalid image data:", evidenceData);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptData = checkoutData.receipt; // Data dari database (object number)
    const mimeType = "image/jpeg"; // Sesuaikan dengan tipe gambar

    if (receiptData && Object.keys(receiptData).length > 0) {
      // Konversi object number ke Uint8Array
      const byteArray = new Uint8Array(Object.values(receiptData));
      const blob = new Blob([byteArray], { type: mimeType });

      // Buat URL Blob untuk unduhan
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `receipt-${Date.now()}-.jpg`; // Sesuaikan dengan nama file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hapus URL dari memori setelah digunakan
      URL.revokeObjectURL(blobUrl);
    } else {
      console.error("Invalid image data:", receiptData);
    }
  };

  const sendWhatsAppMessage = () => {
    const customer = data?.order.user;
    // const customerPhoneNumber = customer?.phoneNumber;
    const adminPhoneNumber = "+6282121260049";
    const message = `Halo Super Admin, saya ${customer?.name} dengan email ${customer?.email} ingin bertanya mengenai pesanan saya. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex min-h-screen w-full flex-col p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <Card className="w-full max-w-full">
        <CardHeader>
          <div className="flex justify-between border-b-2 border-gray-200 pb-3 ">
            <p className="text-sm text-gray-900 font-semibold">
              Please fill in the form below to complete your purchase.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                size="sm"
                className="border-[1px] border-gray-400"
                onClick={() => sendWhatsAppMessage()}
              >
                <MessageCircle className="w-5 h-5 " />
                Chat Admin
              </Button>
              <div
                className={`flex items-center text-sm justify-center rounded-md border-[1px] shadow-md text-white p-1 w-32 px-2 ${
                  checkoutData.status == "pending"
                    ? "bg-red-500"
                    : checkoutData.status == "paid"
                    ? "bg-green-500"
                    : "bg-blue-500"
                } "`}
              >
                {checkoutData.status.charAt(0).toUpperCase() +
                  checkoutData.status.slice(1)}{" "}
                {checkoutData.status == "pending" && "Payment"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-4">
            <div className="w-1/2 border-[1px] rounded-md shadow-sm border-gray-300">
              <div className="mb-4 h-1/2 px-8 py-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <ul className="space-y-4">
                  {orderItems.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b pb-2"
                    >
                      <div className="w-9/12">
                        <h3 className="text-sm font-medium">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} pcs
                        </p>
                      </div>
                      <div className="items-start w-3/12">
                        <span className="text-sm font-semibold ml-5">
                          Rp {item.product.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between font-semibold text-base">
                  <div className="w-9/12">
                    <span>Total</span>
                  </div>
                  <div className="w-3/12 ">
                    <span className="ml-5">
                      Rp{" "}
                      {orderItems
                        .reduce(
                          (acc: number, item: any) =>
                            acc + item.product.price * item.quantity,
                          0
                        )
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
              {checkoutData.status == "paid" && (
                <div className="h-[50%] px-4 border-t-[1px] pt-4  border-gray-300">
                  <div className="px-4">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-4">
                        Review Order
                      </h2>
                      {!reviewData.isReviewed && (
                        <Button
                          type="reset"
                          variant="outline"
                          size="sm"
                          className="border-[1px] border-gray-400"
                          onClick={handleReview}
                        >
                          <Check className="w-5 h-5 " />
                          Submit
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 mb-4 ">
                      <label htmlFor="address" className="text-sm font-medium">
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            star <= (hovered || reviewData.rating);

                          return (
                            <button
                              key={star}
                              type="button"
                              className={`text-xl transition-colors ${
                                isActive ? "text-yellow-400" : "text-gray-300 "
                              }`}
                              onClick={() =>
                                setReviewData({
                                  ...reviewData,
                                  rating: star,
                                })
                              }
                              onMouseEnter={() =>
                                !reviewData.isReviewed && setHovered(star)
                              }
                              onMouseLeave={() =>
                                !reviewData.isReviewed && setHovered(0)
                              }
                              disabled={reviewData.isReviewed}
                            >
                              <Star fill="currentColor" stroke="currentColor" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="comments" className="text-sm font-medium">
                        Comments
                      </label>
                      <Textarea
                        id="comments"
                        name="comments"
                        value={reviewData.comments}
                        onChange={handleChangeReview}
                        placeholder="Enter your comments"
                        disabled={reviewData.isReviewed}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                </div>

                <div className="space-y-1">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address<span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    value={checkoutData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    disabled={Boolean(checkoutData.status !== "pending")}
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
                      Rp{" "}
                      {orderItems
                        .reduce(
                          (acc: number, item: any) =>
                            acc + item.product.price * item.quantity,
                          0
                        )
                        .toLocaleString("id-ID")}{" "}
                      <br />
                    </span>
                    Please include your name in the memo and upload evidence of
                    the transfer below.
                  </label>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="paymentMethod"
                    className="text-sm font-medium mr-5 mb-1"
                  >
                    Evidence<span className="text-red-500">*</span>
                  </label>
                  {checkoutData.status !== "pending" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="border-[1px] border-gray-400"
                      onClick={handleDownload}
                    >
                      <Download className="w-5 h-5 " />
                      Download Evidence
                    </Button>
                  )}

                  {checkoutData.status == "pending" && (
                    <>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 
               file:bg-gray-100 file:border-0 file:py-2 file:px-4 file:rounded-lg
               hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        onChange={handleFileChange}
                        disabled={Boolean(checkoutData.status !== "pending")}
                      />
                      {errors.evidence && (
                        <p className="text-red-500 text-sm">
                          {errors.evidence}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="paymentMethod"
                    className="text-sm font-medium mr-5 mb-1"
                  >
                    Receipt
                  </label>
                  {checkoutData.status == "on delivery" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="border-[1px] border-gray-400"
                      onClick={handleDownloadReceipt}
                    >
                      <Download className="w-5 h-5 " />
                      Download Receipt
                    </Button>
                  )}
                </div>

                {checkoutData.status == "pending" && (
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
                    <Button
                      onClick={handleCheckout}
                      variant="default"
                      size="lg"
                    >
                      <Save className="w-5 h-5 " />
                      Confirm Payment
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
