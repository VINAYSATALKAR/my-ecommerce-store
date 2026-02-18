"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner"; // <--- Import directly from sonner

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    });
    
    // The new, simpler Sonner syntax
    toast.success(`${product.name} added to cart!`, {
      description: "Check your cart to checkout.",
      duration: 3000,
    });
  };

  return (
    <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={handleAddToCart}>
      <ShoppingCart className="h-5 w-5" />
      Add to Cart
    </Button>
  );
}