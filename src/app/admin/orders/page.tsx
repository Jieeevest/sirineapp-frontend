"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetOrdersQuery } from "../../../services/api";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/helpers/formatCurrency";
import { formatDate } from "@/helpers";
import { useRouter } from "next/navigation";

export default function OrdersOverview() {
  const router = useRouter();
  const { data: orders, refetch } = useGetOrdersQuery();

  useEffect(() => {
    refetch();
  }, [orders, refetch]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle search change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination to first page
  };

  // Filter orders based on search term
  const filteredOrders = orders?.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.userId.toString().includes(searchTerm)
  );

  // Paginate orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    (filteredOrders?.length ? filteredOrders?.length : 0) / itemsPerPage
  );

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 px-8 pt-4">
        <nav className="mb-6 text-sm text-gray-600">
          <ol className="list-none p-0 flex space-x-2">
            <li>
              <a href="/admin/dashboard" className="hover:font-semibold">
                Dashboard
              </a>
            </li>
            <li>&gt;</li>
            <li>
              <a href="/admin/orders" className="hover:font=semibold">
                Orders
              </a>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-gray-800">List Data</li>
          </ol>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-800">
            Order Management
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-2 mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Search Orders
          </label>
          <input
            type="text"
            placeholder="Search by order keyword..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 border rounded-lg w-full"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Manage and view orders and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[50px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="w-[200px]">Order ID</TableHead>
                  {/* <TableHead>User Account</TableHead> */}
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No orders available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders?.map((order, index) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(`/admin/orders/${order.id}/checkout`);
                      }}
                    >
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium hover:underline hover:text-blue-600 hover:underline-offset-4">
                        TRANSACTION-00{order.id}
                      </TableCell>
                      {/* <TableCell>{order.user.name}</TableCell> */}
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center justify-center rounded-md border-[1px] shadow-md text-white p-1 w-32 ${
                            order.status == "pending"
                              ? "bg-red-500"
                              : order.status == "paid"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          } "`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                          {order.status == "pending" && " Payment "}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatDate(order.updatedAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } px-4 py-2 rounded-md text-sm`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
