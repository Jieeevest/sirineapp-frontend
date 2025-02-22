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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Orders Chart */}
        <div className="flex-1">
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
        <div className="flex-1">
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
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order, index) => (
                      <TableRow key={order.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{`ORDER-00${order.id}`}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>{order.totalAmount}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
