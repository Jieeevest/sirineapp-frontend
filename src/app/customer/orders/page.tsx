"use client";
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

export default function Orders() {
  const { data: orders } = useGetOrdersQuery();

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Orders Management
          </h1>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No orders available.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders?.map((order, index) => (
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
