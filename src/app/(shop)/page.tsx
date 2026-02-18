import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  // 1. Fetch ALL products (latest 8)
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { category: true },
  });

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to the Future of Shopping
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover our curated collection of premium products at unbeatable prices.
            </p>
            <Link href="/products">
              <Button size="lg" className="mt-4">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            No products found. Add some from the Admin Panel!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="p-0">
                  {/* Link to the specific product page */}
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square w-full bg-gray-100 cursor-pointer">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="p-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:underline"
                  >
                    <CardTitle className="line-clamp-1 text-lg">
                      {product.name}
                    </CardTitle>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <span className="font-bold text-lg">
                    {formatPrice(Number(product.price))}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}