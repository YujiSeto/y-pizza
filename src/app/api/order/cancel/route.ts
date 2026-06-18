import { prisma } from "@/lib/prisma";
import { getLoggedUserFromHeader } from "@/services/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  const loggedUser = await getLoggedUserFromHeader();

  if (!loggedUser) return NextResponse.json({ message: "Login required" }, { status: 401 });
  if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: loggedUser.id,
    },
  });

  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  if (order.status !== "INITIALIZED") {
    return NextResponse.json({ message: "Only initialized orders can be canceled" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELED" },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
