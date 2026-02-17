import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. Standard helper for shadcn components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Custom helper for currency formatting
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}