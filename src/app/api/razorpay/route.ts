import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(req: Request) {
  // 1. Check if keys exist
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys are missing." },
      { status: 500 }
    );
  }

  // 2. Initialize Razorpay inside the function
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount } = await req.json();

    const options = {
      amount: (amount * 100).toString(), // Convert to Paisa
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}