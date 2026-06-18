import { stripe } from "@/lib/stripe";
import { getLoggedUserFromHeader } from "@/services/auth";
import { createNewOrder } from "@/services/order";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { cart } = await request.json();
  const loggedUser = await getLoggedUserFromHeader();

  if (!loggedUser) return NextResponse.json({ message: "Login required" });
  if (!cart || (cart && cart.length <= 0))
    return NextResponse.json({ message: "Cart is empty" });

  const order = await createNewOrder(loggedUser.id, cart);
  if (!order) return NextResponse.json({ message: "Failed to create order" });

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
    cancel_url: `${origin}`,
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

  return NextResponse.json({ order, url: paymentSession.url }, { status: 201 });
}
