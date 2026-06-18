import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { stripe } from "@/lib/stripe";
import {
  CheckCircle,
  CircleDot,
  HomeIcon,
  Mail,
  Package,
  CreditCard,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const sessionId = (await searchParams).session_id as string;
  if (!sessionId) return redirect("/");

  const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (!paymentSession) return redirect("/");

  const status = paymentSession.status;
  const paymentStatus = paymentSession.payment_status;
  const customerName = paymentSession.customer_details?.name;
  const customerEmail = paymentSession.customer_email;
  const paymentMetadata = paymentSession.metadata;

  return (
    <div className="container mx-auto px-4">
      <Header />
      <main className="mb-10 flex flex-col items-center justify-center py-16">
        <div className="relative mb-8">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-teal-400/20 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/25">
            <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Thank you for your order
          {customerName ? (
            <>
              ,{" "}
              <span className="font-semibold text-foreground">
                {customerName}
              </span>
            </>
          ) : (
            ""
          )}
          !
        </p>
        <p className="text-sm text-muted-foreground mb-8 flex items-center gap-1.5">
          <Mail size={14} />A confirmation email will be sent to{" "}
          <span className="font-medium text-foreground">{customerEmail}</span>
        </p>

        {/* Order details card */}
        <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Order Details
          </h2>

          <div className="space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash size={15} />
                Order ID
              </span>
              <span className="text-sm font-mono font-semibold">
                #{paymentMetadata?.order_id}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={15} />
                Order Status
              </span>
              {status === "complete" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  <CheckCircle size={12} />
                  Complete
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                  <CircleDot size={12} />
                  Processing
                </span>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard size={15} />
                Payment
              </span>
              {paymentStatus === "paid" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  <CheckCircle size={12} />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                  <CircleDot size={12} />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>

        <Link href="/" className="mt-8">
          <Button size="lg" className="gap-2 px-8">
            <HomeIcon size={16} />
            Back to Home
          </Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
