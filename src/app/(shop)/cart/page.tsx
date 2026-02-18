"use client";

import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Add this helper function inside your component or outside
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}; 

const handleCheckout = async () => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // 1. Create Order on Backend
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }), // 'total' from your cart
    });

    const order = await response.json();

    if (order.error) {
      alert("Server error. Please try again.");
      return;
    }

    // 2. Open Razorpay Popup
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // You need to add NEXT_PUBLIC_ to your env variable for frontend access
      amount: order.amount,
      currency: order.currency,
      name: "My E-commerce Store",
      description: "Transaction for Order",
      order_id: order.id,
      handler: async function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        // Here we will eventually save the order to your database
        clearCart(); 
      },
      prefill: {
        name: "Vinay Satalkar", // We'll make this dynamic later
        email: "vinay@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate Total Price
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null; // Avoid flickering on load

  return (
    <div className="container py-10 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl">
          <div className="bg-muted p-6 rounded-full mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link href="/">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        // CART ITEMS STATE
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border p-4 rounded-lg bg-card"
              >
                {/* Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => clearCart()}
            >
              Clear Cart
            </Button>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              <Button size="lg" className="w-full gap-2">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
