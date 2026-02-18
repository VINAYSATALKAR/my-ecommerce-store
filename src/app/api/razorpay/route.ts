import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(req: Request) {
  // 1. Check if keys exist inside the function (Runtime check)
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys are missing. Payment disabled." },
      { status: 500 }
    );
  }

  // 2. Initialize Razorpay HERE, not at the top
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount } = await req.json();

  const options = {
    amount: (amount * 100).toString(),
    currency: "INR",
    receipt: shortid.generate(),
  };

  try {
    const order = await instance.orders.create(options);
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}