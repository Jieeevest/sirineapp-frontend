"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from "../../../services/api";
import { useState } from "react";

export default function Orders() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle deletion
  const handleDeleteOrder = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
      } catch (err) {
        console.log(err);
      }
    }
  };

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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Orders Management
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-2 mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Search Orders
          </label>
          <input
            type="text"
            placeholder="Search by Order ID or User ID..."
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
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentOrders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No orders available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentOrders?.map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell>ORDER-00{order.id}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.createdAt}</TableCell>
                      <TableCell>{order.updatedAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
