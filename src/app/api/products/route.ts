import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, categoryName } = body;

    // 1. Check if the category exists. If not, create it!
    let category = await db.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      category = await db.category.create({
        data: { name: categoryName },
      });
    }

    // 2. Create the new product
    const product = await db.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: [imageUrl], // Saving as an array because your schema requires String[]
        categoryId: category.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Database Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
