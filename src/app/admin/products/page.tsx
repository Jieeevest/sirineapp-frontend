"use client";
import { useState } from "react";
import { File, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "../../../services/api"; // Import RTK Query hooks
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

export default function Products() {
  const [showFilter, setShowFilter] = useState(false);

  const { data: productsData, isLoading, isError } = useGetProductsQuery();

  const toggleFilterCard = () => {
    setShowFilter(!showFilter);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="flex min-h-screen w-full min-w-[1000px] flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Product Management
          </h1>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="lg"
              className="h-8 gap-1 text-sm"
              onClick={toggleFilterCard}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Add Product</span>
            </Button>
          </div>
        </div>

        {/* Data Table Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage and view products and their details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[50px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="w-[100px]">Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No products available.
                    </TableCell>
                  </TableRow>
                ) : (
                  productsData?.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell">
                        {index + 1}
                      </TableCell>
                      <TableCell>{"PRODUCT-" + product.id}</TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.createdAt}</TableCell>
                      <TableCell>{product.updatedAt}</TableCell>
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
