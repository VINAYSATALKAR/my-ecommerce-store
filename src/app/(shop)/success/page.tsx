"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Payment Successful!
      </h1>
      
      <p className="mb-8 max-w-lg text-lg text-muted-foreground">
        Thank you for your purchase. Your order has been received and is currently being processed.
      </p>

      {paymentId && (
        <div className="mb-8 rounded-lg border bg-muted/50 px-6 py-4">
          <p className="text-sm text-muted-foreground">Transaction ID</p>
          <p className="font-mono font-medium">{paymentId}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

// Next.js requires components using useSearchParams to be wrapped in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}