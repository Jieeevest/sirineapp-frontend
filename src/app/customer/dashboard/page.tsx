/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetOrdersQuery,
  useGetProductsQuery,
  useGetRolesQuery,
  useGetUsersQuery,
} from "../../../services/api";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatCurrency } from "@/helpers/formatCurrency";
import { formatDate } from "@/helpers";
import { useRouter } from "next/navigation";

// Register chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const router = useRouter();
  const { data: orders } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();
  const { data: products } = useGetProductsQuery();
  const { data: roles } = useGetRolesQuery();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);

  // Filtering pending orders
  useEffect(() => {
    if (orders) {
      setPendingOrders(orders.filter((order) => order.status === "pending"));
    }
  }, [orders]);

  // Orders chart data
  const orderCounts = orders?.reduce((acc: any, order: any) => {
    const date = order.createdAt.split("T")[0]; // Group by date
    if (!acc[date]) acc[date] = 0;
    acc[date]++;
    return acc;
  }, {});

  const chartData = {
    labels: orderCounts ? Object.keys(orderCounts) : [],
    datasets: [
      {
        label: "Orders Over Time",
        data: orderCounts ? Object.values(orderCounts) : [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Calculate total users and orders
  const totalUsers = users?.length || 0;
  const totalProducts = products?.length || 0;
  const totalRoles = roles?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalPendingOrders = pendingOrders.length;

  return (
    <div className="flex min-h-screen flex-col p-4 gap-2">
      {/* First Row: Total Counts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
        {/* Card: Total Users */}
        <div className="flex-1 border-r-2 border-r-black rounded-xl">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
        </div>
        {/* Card: Total Users */}
        <div className="flex-1 border-r-2 border-r-blue-500 rounded-xl">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl font-bold">{totalProducts}</p>
            </CardContent>
          </Card>
        </div>
        {/* Card: Total Users */}
        <div className="flex-1 border-r-2 border-r-teal-500 rounded-xl">
          <Card>
            <CardHeader>
              <CardTitle>Total Roles</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl font-bold">{totalRoles}</p>
            </CardContent>
          </Card>
        </div>

        {/* Card: Total Orders */}
        <div className="flex-1 border-r-2 border-r-green-500 rounded-xl">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl font-bold">{totalOrders}</p>
            </CardContent>
          </Card>
        </div>

        {/* Card: Pending Orders */}
        <div className="flex-1 border-r-2 border-r-yellow-500 rounded-xl">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl font-bold">{totalPendingOrders}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row: Chart and Pending Orders Table */}
      <div className="flex justify-between gap-2">
        {/* Left Section: Orders Chart */}
        <div className="w-[550px]">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Line Chart for Orders */}
              <Line data={chartData} />
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Pending Orders Table */}
        <div className="w-[800px]">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                View and manage pending orders here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  No pending orders available.
                </div>
              ) : (
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
                    {pendingOrders?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No orders available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingOrders?.map((order, index) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/customer/orders/${order.id}/checkout`
                            );
                          }}
                        >
                          <TableCell className="hidden sm:table-cell">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium hover:underline hover:text-blue-600 hover:underline-offset-4">
                            TRANSACTION-00{order.id}
                          </TableCell>
                          {/* <TableCell>{order.user.name}</TableCell> */}
                          <TableCell>
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
