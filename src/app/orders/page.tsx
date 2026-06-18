import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserOrders } from "@/services/order";
import { decimalToMoney } from "@/lib/utils";
import { Package, Clock} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { PayOrderButton } from "@/components/orders/pay-order-button";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";

const statusMap: Record<string, { label: string; color: string }> = {
  INITIALIZED: { label: "Waiting for Payment", color: "bg-yellow-500" },
  IN_REVIEW: { label: "In Review", color: "bg-orange-500" },
  PAID: { label: "Paid - Preparing", color: "bg-blue-500" },
  SENT: { label: "Out for Delivery", color: "bg-purple-500" },
  DELIVERED: { label: "Delivered", color: "bg-green-500" },
  CANCELED: { label: "Canceled", color: "bg-red-500" },
};

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="container mx-auto px-4">
        <Header />
        <main className="mb-10 flex flex-col items-center justify-center py-20">
          <Package className="h-24 w-24 text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">You need to log in</h1>
          <p className="text-muted-foreground mb-6">Log in to view your orders.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Get user from token
  const user = await prisma.user.findFirst({
    where: { token },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4">
        <Header />
        <main className="mb-10 py-20 text-center">
          <h1 className="text-2xl font-bold">User not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const rawOrders = await getUserOrders(user.id);
  // Serialize complex objects like Prisma Decimal and Date before sending to client UI
  const orders = JSON.parse(JSON.stringify(rawOrders));

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col">
      <Header />
      <main className="mb-10 flex-grow">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-xl border border-border">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const statusConfig = statusMap[order.status] || { label: order.status, color: "bg-gray-500" };
              const shipping = 5; // Default shipping used in your store
              const total = parseFloat(order.subtotal) + shipping;

              return (
                <Card key={order.id} className="overflow-hidden border-border/50 shadow-sm">
                  <div className={`h-1.5 w-full ${statusConfig.color}`} />
                  <CardHeader className="bg-secondary/20 pb-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">Order #{order.id}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <Clock size={14} /> 
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`${statusConfig.color} text-white border-transparent px-3 py-1 text-sm`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-grow">
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Items</h4>
                        <div className="space-y-3">
                          {order.orderProducts.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-md overflow-hidden bg-secondary flex-shrink-0 relative">
                                  {/* Using a simple img tag for simplicity, or we could use next/image */}
                                  <img 
                                    src={`/pizzas/${item.product.image}`} 
                                    alt={item.product.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.quantity}x {item.product.name}</p>
                                  <p className="text-sm text-muted-foreground">{decimalToMoney(parseFloat(item.price))}</p>
                                </div>
                              </div>
                              <span className="font-semibold">
                                {decimalToMoney(item.quantity * parseFloat(item.price))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:w-64 flex-shrink-0 bg-secondary/30 p-5 rounded-lg">
                        <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{decimalToMoney(parseFloat(order.subtotal))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{decimalToMoney(shipping)}</span>
                          </div>
                          <div className="pt-3 mt-3 border-t flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">{decimalToMoney(total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.status === "INITIALIZED" && (
                      <div className="mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-end">
                        <div className="w-full sm:w-48">
                          <CancelOrderButton orderId={order.id} />
                        </div>
                        <div className="w-full sm:w-48">
                          <PayOrderButton orderId={order.id} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
