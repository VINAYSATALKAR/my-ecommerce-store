import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET: Fetch a single product
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; // <-- NEXT.JS 15 FIX
    const product = await db.product.findUnique({
      where: { id: resolvedParams.id },
      include: { category: true }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// 2. PATCH: Save edits
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; // <-- NEXT.JS 15 FIX
    const body = await req.json();
    const { name, description, price, imageUrl, categoryName } = body;

    let category = await db.category.findFirst({ where: { name: categoryName } });
    if (!category) {
      category = await db.category.create({ data: { name: categoryName } });
    }

    const updatedProduct = await db.product.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        images: [imageUrl],
        categoryId: category.id,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// 3. DELETE: Remove product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; // <-- NEXT.JS 15 FIX
    await db.product.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}