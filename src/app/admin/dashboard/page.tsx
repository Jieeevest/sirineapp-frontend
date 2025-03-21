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

const currentDate = new Date();
const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // "MM"
const currentYear = String(currentDate.getFullYear()); // "YYYY"

export default function Dashboard() {
  const router = useRouter();
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();
  const { data: products } = useGetProductsQuery();
  const { data: roles } = useGetRolesQuery();
  const [monthlyFilter, setMonthlyFilter] = useState(currentMonth);
  const [yearlyFilter, setYearlyFilter] = useState(currentYear);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!orders?.length) return;

    // Filter orders berdasarkan status
    const pending = orders.filter((order) => order.status === "pending");
    setPendingOrders(pending); // Simpan order yang statusnya "pending"

    // Filter orders berdasarkan bulan & tahun
    const filtered = orders.filter((order) => {
      if (order.status === "pending" || !order.createdAt) return false;

      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate.getTime())) return false; // Pastikan tanggal valid

      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, "0"); // "MM"
      const orderYear = String(orderDate.getFullYear()); // "YYYY"

      const monthMatches = monthlyFilter ? orderMonth === monthlyFilter : true;
      const yearMatches = yearlyFilter ? orderYear === yearlyFilter : true;

      return monthMatches && yearMatches;
    });

    setFilteredOrders(filtered);
  }, [orders, monthlyFilter, yearlyFilter]);

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

  if (isLoading) return <div>Loading...</div>;

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
        <div className="w-[550px] h-80">
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
                <Table className="h-60">
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
      <div className="w-full mt-5">
        <Card>
          <CardHeader>
            <CardTitle>Montly Orders</CardTitle>
            <CardDescription>
              View and manage monthly orders here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                No monthly orders available.
              </div>
            ) : (
              <>
                <FilterOrders
                  onFilterChange={(month, year) => {
                    setMonthlyFilter(month);
                    setYearlyFilter(year);
                  }}
                  defaultMonth={monthlyFilter}
                  defaultYear={yearlyFilter}
                />
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
                    {filteredOrders?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No orders available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders?.map((order, index) => (
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface FilterOrdersProps {
  onFilterChange: (month: string, year: string) => void;
  defaultMonth: string;
  defaultYear: string;
}

const FilterOrders: React.FC<FilterOrdersProps> = ({
  onFilterChange,
  defaultMonth,
  defaultYear,
}) => {
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const handleFilterChange = () => {
    onFilterChange(month, year);
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border rounded-md p-2"
      >
        <option value="">All Months</option>
        {Array.from({ length: 12 }, (_, i) => {
          const monthValue = String(i + 1).padStart(2, "0");
          return (
            <option key={monthValue} value={monthValue}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </option>
          );
        })}
      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border rounded-md p-2"
      >
        <option value="">All Years</option>
        {Array.from({ length: 5 }, (_, i) => {
          const currentYear = new Date().getFullYear();
          const yearValue = String(currentYear - i);
          return (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          );
        })}
      </select>

      <button
        onClick={handleFilterChange}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
      >
        Apply Filter
      </button>
    </div>
  );
};
