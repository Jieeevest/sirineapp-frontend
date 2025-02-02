"use client";
import { useState } from "react";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";
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

// Example data for orders
const ordersData = [
  {
    id: 1,
    userId: 101,
    userName: "John Doe",
    totalAmount: 150.75,
    status: "Pending",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-02",
  },
  {
    id: 2,
    userId: 102,
    userName: "Jane Smith",
    totalAmount: 250.5,
    status: "Shipped",
    createdAt: "2023-01-05",
    updatedAt: "2023-01-06",
  },
];

export default function Orders() {
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilterCard = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="lg"
              className="h-7 gap-1 text-sm"
              onClick={toggleFilterCard}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Order</span>
            </Button>
            <Button size="lg" variant="default" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
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
                  <TableHead>User</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
