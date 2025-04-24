/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ShoppingBag, ShoppingCart } from "lucide-react";
import {
  useCreateOrderMutation,
  useGetPublicCategoriesQuery,
} from "@/services/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/helpers/formatCurrency";
import Loading from "@/components/atoms/Loading";

// Product type definition
type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  description?: string;
  discount?: number;
  quantity: number;
};

const user = {
  accessToken: localStorage?.getItem("accessToken"),
  name: localStorage?.getItem("userName"),
  email: localStorage?.getItem("userEmail"),
  role: localStorage?.getItem("userRoleName"),
  avatar: "/avatars/shadcn.jpg",
};

function convertBinaryImageToDataURL(
  imageData: { [key: string]: number },
  mimeType = "image/png"
): string {
  const byteArray = new Uint8Array(Object.values(imageData));
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob); // ini langsung bisa jadi src untuk <img>
}

export default function SirineSaleLanding() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const { data: categoriesData } = useGetPublicCategoriesQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.map((category) => category.name));
      // Initialize an empty object to store the categorized products
      const categorizedProducts: any = {};

      // Loop through each category in the categoriesData
      categoriesData.forEach((category: any) => {
        // Initialize an empty array for each category, if it doesn't exist
        if (!categorizedProducts[category.name]) {
          categorizedProducts[category.name] = [];
        }

        // Loop through each product in the category and push it to the respective category array
        category.products.forEach((product: any) => {
          let imageSrc: string;

          if (product.image && typeof product.image === "object") {
            imageSrc = convertBinaryImageToDataURL(product.image, "image/png");
          } else {
            imageSrc = "/notfound.png";
          }

          categorizedProducts[category.name].push({
            id: product.id,
            name: product.name,
            price: String(product.price),
            image: imageSrc,
            quantity: product.stock,
          });
        });
      });

      // Set the categorized products state
      setProducts(categorizedProducts);
    }
  }, [categoriesData]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Automotive Accessories"
  );

  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      console.log("Your cart is empty.");
      return;
    }

    setIsCartOpen(false);

    try {
      Swal.fire({
        title: "Are you sure?",
        text: "Please confirm your order to proceed to checkout.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, confirm",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await createOrder({
            userEmail: String(user.email),
            cart: cart.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          }).unwrap();

          const result = await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Order placed successfully!",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            router.push("/customer/orders");
          }
        } else if (res.isDismissed) {
          setIsCartOpen(true);
        }
      });
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.data.message,
        confirmButtonText: "OK",
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.name === product.name
      );

      if (existingProduct) {
        // Increment quantity if the product already exists in the cart
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new product with quantity set to 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.name === product.name
      );

      if (existingProduct && existingProduct.quantity > 1) {
        // Decrease quantity if more than 1 item exists
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      // Remove product from cart if quantity is 1
      return prevCart.filter((item) => item.name !== product.name);
    });
  };

  const handleIncrementQuantity = (product: Product) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const handleDecrementQuantity = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.name === product.name
      );

      if (existingProduct && existingProduct.quantity > 1) {
        // Decrease quantity if more than 1 item exists
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      // If quantity is 1, remove the item
      return prevCart.filter((item) => item.name !== product.name);
    });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) =>
        total +
        parseInt(String(item?.price?.replace(/\./g, ""))) * item.quantity, // Multiply price by quantity
      0
    );
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and all your data will be cleared.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.clear();

        const result = await Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have been successfully logged out.",
          confirmButtonText: "OK",
        });

        if (result.isConfirmed) {
          router.push("/auth/login");
        }
      } else if (result.isDismissed) {
        console.log("Logout cancelled.");
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white text-gray-800 py-4">
        <Container>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              <a
                href="#"
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 0, 0, 0.3), 0 0 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                Gudang Sirine
              </a>
            </div>

            <nav>
              <ul className="flex space-x-8">
                {/* Check if accessToken exists in localStorage */}
                {user.accessToken ? (
                  <>
                    <li>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center space-x-2 cursor-pointer">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage
                                src={
                                  localStorage.getItem("avatar") ||
                                  "/avatars/shadcn.jpg"
                                } // Fallback to a default avatar
                                alt={localStorage.getItem("userName") || "User"}
                              />
                              <AvatarFallback className="rounded-lg">
                                {user.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                              <span className="truncate font-semibold">
                                {user.name}
                              </span>
                              <span className="truncate text-xs">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                          side="bottom"
                          align="end"
                          sideOffset={4}
                        >
                          <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name || "User"}
                                />
                                <AvatarFallback className="rounded-lg">
                                  {user.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                  {user.name}
                                </span>
                                <span className="truncate text-xs">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                user.role == "Admin"
                                  ? "/admin/orders"
                                  : "/customer/orders"
                              )
                            }
                            className="cursor-pointer"
                          >
                            <ShoppingBag />
                            My Showcase
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer"
                          >
                            <LogOut />
                            Log out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                    <li>
                      <div
                        role="button"
                        onClick={() => setIsCartOpen(true)}
                        className="relative flex items-center space-x-2 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-all duration-300"
                      >
                        <ShoppingCart size={24} />
                        {/* Cart item count indicator */}
                        {cart.length ? (
                          <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center -mt-2 -mr-2">
                            {cart.length}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  // If no accessToken, show Sign In link
                  <li>
                    <a
                      href="/auth/login"
                      className="hover:text-blue-400"
                      style={{
                        textShadow:
                          "2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 0, 0, 0.3), 0 0 50px rgba(0, 0, 0, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sign In
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </Container>
      </header>
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden px-6">
        <Image
          src="https://img.freepik.com/premium-photo/blue-police-car-light-night-city-with-selective-focus-bokeh-black-background_636705-5794.jpg?semt=ais_hybrid"
          alt="Sirine Perfume Background"
          fill
          className="absolute z-0 object-cover opacity-100"
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 md:mb-8"
            style={{
              textShadow:
                "3px 3px 5px rgba(0, 0, 0, 0.3), 0 0 25px rgba(0, 0, 0, 0.3), 0 0 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            Sirine Fragrances
          </h1>
          <p
            className="text-xl md:text-2xl text-white mb-10 md:mb-12"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Discover the essence of elegance with our exclusive fragrances
          </p>
        </div>
      </section>
      {/* <section className="py-8 px-6 bg-gray-100">
        <Container>
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="font-bold text-lg">
                You have selected{" "}
                <span className="text-blue-600">{cart.length}</span> items in
                your cart
              </p>
              <p className="font-bold text-lg">
                Total Price:{" "}
                <span className="text-blue-600">Rp. {calculateTotal()}</span>
              </p>
            </div>
            <Button
              onClick={() => setIsCartOpen(true)} // Open the modal
              className="border-[1px] border-gray-300 shadow-sm bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-3 rounded-full transition-all hover:scale-105 hover:from-blue-600 hover:to-indigo-500"
            >
              <span className="text-lg font-semibold">View Cart</span>
            </Button>
          </div>
        </Container>
      </section> */}

      {/* Categories Section */}
      <section className="py-6 px-6">
        <Container>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                className={`border-[1px] border-gray-300 ${
                  selectedCategory === category
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-black hover:bg-gray-50"
                } px-6 py-2 rounded-full shadow-sm transition-all hover:scale-110`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Listings */}
      {selectedCategory && (
        <section className="py-10 px-6">
          <Container>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                {selectedCategory}
              </h2>
            </div>
            {products[selectedCategory]?.length === 0 ? (
              <div className="flex justify-center items-center">
                <p className="text-center text-gray-500 font-semibold text-xl">
                  No products available in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products[selectedCategory]?.map((item: any, index: any) => (
                  <Card
                    key={index}
                    className={`bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 hover:shadow-black/20 ease-in-out border-[1px] border-gray-300 hover:cursor-pointer`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <CardHeader className="p-4 min-h-28">
                      <CardTitle
                        className="text-black text-base font-medium line-clamp-3"
                        title={item.name} // Tooltip for the full text
                      >
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <p className="text-gray-500 text-sm font-medium px-4">
                      <span className="">{item.quantity}</span> items left
                    </p>

                    <CardContent className="px-4">
                      <p className="text-gray-700 text-lg font-bold">
                        <span className="mr-2">
                          {formatCurrency(item.price)}{" "}
                          <span className="text-gray-500 text-sm font-medium">
                            / item
                          </span>
                        </span>
                      </p>
                      {user.accessToken && (
                        <Button
                          className="mt-4 w-full bg-gray-800 hover:bg-gray-900 hover:scale-105 text-white"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="min-w-[800px]">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
          </DialogHeader>
          {cart.length > 0 ? (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto border-[1px] border-gray-300"
                >
                  <div className="mr-10">
                    <p className="text-lg font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      {formatCurrency(Number(item.price))} per item
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      color="gray"
                      onClick={() => handleDecrementQuantity(item)}
                    >
                      -
                    </Button>
                    <p className="text-lg font-medium">{item.quantity}</p>
                    <Button
                      variant="outline"
                      color="gray"
                      onClick={() => handleIncrementQuantity(item)}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      color="red"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold">
                  Total: Rp.{calculateTotal().toLocaleString()}
                </p>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmit}
                >
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <Container className="text-center">
          <p className="text-sm">
            &copy; 2025 Sirine Fragrances. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
}
