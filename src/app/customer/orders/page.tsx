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
import { formatDate } from "@/helpers";
import { formatCurrency } from "@/helpers/formatCurrency";
import { useRouter } from "next/navigation";

export default function Orders() {
  const router = useRouter();
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
                  <TableHead className="w-[200px]">Order ID</TableHead>
                  {/* <TableHead>User Account</TableHead> */}
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
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(`/customer/orders/${order.id}/checkout`);
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
                          className={`flex items-center justify-center rounded-md border-[1px] shadow-md text-white p-1 w-20 ${
                            order.status == "pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          } "`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
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
      </main>
    </div>
  );
}
