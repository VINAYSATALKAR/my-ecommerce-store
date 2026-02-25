import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, amount } = body;

    const order = await db.order.create({
      data: {
        amount: amount,
        status: "PAID",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}