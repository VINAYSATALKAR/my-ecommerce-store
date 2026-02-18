import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shop/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // Updated for Next.js 15
}) {
  const { id } = await params; // Await the params

  const product = await db.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-50 shadow-sm">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Details & Add to Cart */}
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            <p className="text-xl font-semibold text-primary">
              {formatPrice(Number(product.price))}
            </p>
          </div>
          
          <div className="border-t border-b py-4">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.images[0],
              }} 
            />
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Buy Now
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Category: <span className="font-medium text-foreground">{product.category.name}</span></p>
            <p>Free shipping on all orders over ₹499.</p>
          </div>
        </div>
      </div>
    </div>
  );
}