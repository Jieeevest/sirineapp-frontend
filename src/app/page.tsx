"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Product type definition
type Product = {
  name: string;
  price: string;
  image: string;
  description?: string;
  discount?: number;
  quantity: number;
};

type ProductsByCategory = {
  [key: string]: Product[];
};

export default function SirineSaleLanding() {
  const categories = [
    "Automotive Accessories",
    "Electronics",
    "Speakers",
    "Strobes",
    "Low Frequency",
    "Sirens",
  ];

  const products: ProductsByCategory = {
    "Automotive Accessories": [
      {
        name: "LOW FREQ BASS GETAR REPLIKA FENIEX HAMMER SUPER KENCANG WATERPROOF AWET MOBIL DINAS",
        price: "4.200.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/16/36c1845d-54df-4f92-84cd-01bd72936840.jpg",
        quantity: 0,
      },
      {
        name: "SIRINE WHELEN HHS3200 ORIGINAL SIREN HHS 3200 WHELEN PATWAL PEJABAT POLISI TNI KENDARAAN MOBIL DINAS SUPER KENCANG BRANDED",
        price: "8.000.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/9/30/6e611fcc-fdb0-4df8-8d34-c923009294f3.jpg",
        quantity: 0,
      },
      {
        name: "LOW FREQ BASS GETAR SIRINE TOA KLAKSON MOBIL SENKEN SANKEN",
        price: "3.830.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/7/22/dd63c407-c444-45cb-bd2f-960c633c9776.jpg",
        quantity: 0,
      },
      {
        name: "SPEAKER KECIL MINI YH340 KLAKSON SIRINE MOTOR MOBIL AMBULANCE PATWAL PENGAWALAN VVIP SUPER KENCANG",
        price: "1.500.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/6/28/42868d42-063e-4e7f-a3f0-56ce810b0ad5.jpg",
        quantity: 0,
      },
    ],
    Electronics: [
      {
        name: "ROBOT VACUM PEL PENYAPU SAPU LANTAI RUMAH BERSIH DIRUMAH AJA ANTIVIRUS - Ungu",
        price: "250.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2021/1/13/e4fa13ed-de13-47b4-953a-31c24d537099.jpg",
        quantity: 0,
      },
      {
        name: "KAMERA CAMERA ANALOG FUJIFILM ROLL FILM JADUL NEW FULLSET VINTAGE",
        price: "110.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2021/9/11/a8c0e826-06db-4ff6-985e-ca035f219d6f.jpg",
        quantity: 0,
      },
      {
        name: "Toa 10 watt oval / Zh-610S",
        price: "280.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/product-1/2018/10/5/1991856/1991856_64cb8174-b95c-4857-b6c3-454b2733ba67_720_1280.jpg",
        quantity: 0,
      },
    ],
    Speakers: [
      {
        name: "SPEAKER KECIL MINI YH340 KLAKSON SIRINE MOTOR MOBIL AMBULANCE PATWAL PENGAWALAN VVIP SUPER KENCANG",
        price: "1.500.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/6/28/42868d42-063e-4e7f-a3f0-56ce810b0ad5.jpg",
        quantity: 0,
      },
      {
        name: "SPEAKER SIRINE KLAKSON MOBIL PATWAL REPLIKA WHELEN STS 340 M340 AMBULANCE DAMKAR RESCUE PENGAWALAN POLISI TNI",
        price: "2.200.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/5/12/624b14da-5193-4732-89e6-e7b8eff773d8.jpg",
        quantity: 0,
      },
    ],
    Strobes: [
      {
        name: "STROBO DASHBOARD REPLIKA AVENGER WHELEN SUPER TERANG PABRIKAN GARANSI",
        price: "1.200.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/3/28/d00d17dd-cfd1-440b-98cb-20a4c3df31dd.jpg",
        quantity: 0,
      },
      {
        name: "STICKBAR PABRIKAN H8 QUAD SUPER TERANG BUTA LIGHTBAR 1 SISI",
        price: "3.900.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/1/1/97809393-cb16-47b8-a942-f5cdce693a62.jpg",
        quantity: 0,
      },
    ],
    "Low Frequency": [
      {
        name: "LOW FREQ BASS GETAR REPLIKA FENIEX HAMMER SUPER KENCANG WATERPROOF AWET MOBIL DINAS",
        price: "4.200.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/11/16/36c1845d-54df-4f92-84cd-01bd72936840.jpg",
        quantity: 0,
      },
      {
        name: "LOW FREQ BASS GETAR SIRINE TOA KLAKSON MOBIL SENKEN SANKEN",
        price: "3.830.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/7/22/dd63c407-c444-45cb-bd2f-960c633c9776.jpg",
        quantity: 0,
      },
    ],
    Sirens: [
      {
        name: "SIRINE WHELEN HHS3200 ORIGINAL SIREN HHS 3200 WHELEN PATWAL PEJABAT POLISI TNI KENDARAAN MOBIL DINAS SUPER KENCANG BRANDED",
        price: "8.000.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2024/9/30/6e611fcc-fdb0-4df8-8d34-c923009294f3.jpg",
        quantity: 0,
      },
      {
        name: "SIRINE SIREN IC WHELEN HHS HANDLE KLAKSON MOBIL DINAS POLISI TNI DISHU",
        price: "1.300.000",
        image:
          "https://images.tokopedia.net/img/cache/200-square/VqbcmM/2023/11/22/1eacbe0b-7548-4940-a8ed-ed3ecdd22ec3.jpg",
        quantity: 0,
      },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Automotive Accessories"
  );

  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle modal visibility

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
        total + parseInt(item.price.replace(/\./g, "")) * item.quantity, // Multiply price by quantity
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-screen flex items-center justify-center overflow-hidden px-6">
        <Image
          src="https://img.freepik.com/premium-photo/blue-police-car-light-night-city-with-selective-focus-bokeh-black-background_636705-5794.jpg?semt=ais_hybrid"
          alt="Sirine Perfume Background"
          fill
          className="absolute z-0 object-cover opacity-100"
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 md:mb-8">
            Sirine Fragrances
          </h1>
          <p className="text-xl md:text-2xl text-white mb-10 md:mb-12">
            Discover the essence of elegance with our exclusive fragrances
          </p>
        </div>
      </section>
      <section className="py-8 px-6 bg-gray-100">
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
              className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-400"
            >
              <span className="text-lg font-semibold">View Cart</span>
            </Button>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-6 px-6">
        <Container>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                className={`${
                  selectedCategory === category
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-black hover:bg-gray-200"
                } px-6 py-2 rounded-full shadow-md transition-all`}
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
              <p className="text-center text-gray-500">
                No products available in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products[selectedCategory]?.map((item, index) => (
                  <Card
                    key={index}
                    className={`bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 hover:shadow-black/20 ease-in-out`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <CardHeader className="p-4">
                      <CardTitle
                        className="text-black text-base font-medium line-clamp-3"
                        title={item.name} // Tooltip for the full text
                      >
                        {item.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4">
                      <p className="text-gray-700 text-lg font-bold">
                        <span className="mr-2">Rp.{item.price}</span>
                      </p>
                      <Button
                        className="mt-4 w-full bg-gray-800 hover:bg-gray-900 hover:scale-105 text-white"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
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
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto"
                >
                  <div className="mr-10">
                    <p className="text-lg font-medium">{item.name}</p>
                    <p className="text-gray-500">Rp.{item.price}</p>
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
                <Button className="bg-green-600 text-white">Checkout</Button>
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
