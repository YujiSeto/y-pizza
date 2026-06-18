import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getLoggedUserFromHeader } from "@/services/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { orderId } = await request.json();
  const loggedUser = await getLoggedUserFromHeader();

  if (!loggedUser) return NextResponse.json({ message: "Login required" }, { status: 401 });
  if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: loggedUser.id,
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  if (order.status !== "INITIALIZED") return NextResponse.json({ message: "Order is already paid or processing" }, { status: 400 });

  const paymentItems = [];
  for (let item of order.orderProducts) {
    paymentItems.push({
      price_data: {
        currency: "usd",
        unit_amount: parseFloat(item.product.price.toString()) * 100,
        product_data: {
          name: item.product.name,
        },
      },
      quantity: item.quantity,
    });
  }

  const paymentSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/orders`,
    line_items: paymentItems,
    customer_email: loggedUser.email,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Standard Shipping",
          type: "fixed_amount",
          fixed_amount: {
            amount: 500,
            currency: "usd",
          },
        },
      },
    ],
    metadata: {
      order_id: order.id,
    },
  });

  return NextResponse.json({ url: paymentSession.url }, { status: 200 });
}
