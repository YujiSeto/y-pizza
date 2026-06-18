"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { apiWithAuth } from "@/lib/axios";

type Props = {
  orderId: number;
};

export const PayOrderButton = ({ orderId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await apiWithAuth.post("/order/pay", { orderId });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Failed to generate payment url", error);
      alert("Failed to proceed to payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePay} 
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      {loading ? "Processing..." : "Pay Now"}
    </Button>
  );
};
