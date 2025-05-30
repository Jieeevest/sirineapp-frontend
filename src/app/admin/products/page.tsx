"use client";
import { MoreHorizontal, PlusCircle } from "lucide-react";
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
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import Loading from "@/components/atoms/Loading";

export default function Products() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: products, refetch, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  // State for pagination and search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set how many items per page

  useEffect(() => {
    refetch();
  }, [products, refetch]);

  const handleAddProduct = () => {
    setLoading(true);
    router.push("/admin/products/create");
  };

  const handleUpdateProduct = (id: number) => {
    setLoading(true);
    router.push(`/admin/products/${id}/update`);
  };

  const handleDeleteProduct = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will delete this product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await deleteProduct(id).then(async () => {
          const result = await Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "You have been successfully delete this product.",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            setLoading(false);
            refetch();
          }
        });
      } else if (result.isDismissed) {
        setLoading(false);
        console.log("Delete cancelled.");
      }
    });
  };

  // Filter products by search term
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    (filteredProducts?.length ? filteredProducts?.length : 0) / itemsPerPage
  );

  if (isLoading || loading) return <Loading />;

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
              <a href="/admin/products" className="hover:font=semibold">
                Products
              </a>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-gray-800">List Data</li>
          </ol>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-800">
            Product Management
          </h1>
          <Button
            variant="default"
            size="lg"
            className="h-10 gap-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
            onClick={handleAddProduct}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Product</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 rounded-lg w-full border-[1px] border-gray-300 mt-2 focus:outline-none focus:border-gray-800"
          />
        </div>

        {/* Data Table Card */}
        <Card className="w-full shadow-sm border-[1px] border-gray-300">
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
                  <TableHead className="w-[130px] justify-center">
                    Product ID
                  </TableHead>
                  <TableHead className="w-[400px] justify-center">
                    Product Name
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-[100px] text-center">Stock</TableHead>
                  <TableHead className="w-[150px] text-center">
                    Show Catalog
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No products available.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts?.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell">
                        {itemsPerPage * (currentPage - 1) + index + 1}
                      </TableCell>
                      <TableCell>{"PRODUCT-00" + product.id}</TableCell>
                      <TableCell className="font-medium w-80">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      {/* <TableCell>{product.description || "-"}</TableCell> */}
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <p
                          className={`font-medium text-center ${
                            product.stock <= 10 ? "text-red-500" : ""
                          }`}
                        >
                          {product.stock || "0"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {
                          <Badge
                            variant={
                              product.isPublic ? "outline" : "destructive"
                            }
                          >
                            {product.isPublic ? "Yes" : "No"}
                          </Badge>
                        }
                      </TableCell>

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
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleUpdateProduct(product.id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteProduct(product.id)}
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
          <Pagination className="mt-4 cursor-pointer">
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
