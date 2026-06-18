import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Webhook received");
  return NextResponse.json({ message: "OK" });
}