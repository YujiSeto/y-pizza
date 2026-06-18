"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import { apiWithAuth } from "@/lib/axios";

type Props = {
  orderId: number;
};

export const CancelOrderButton = ({ orderId }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      setLoading(true);
      await apiWithAuth.post("/order/cancel", { orderId });
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel order", error);
      alert("Failed to cancel the order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={handleCancel} 
      disabled={loading}
      className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <XCircle className="mr-2 h-4 w-4" />
      )}
      {loading ? "Canceling..." : "Cancel Order"}
    </Button>
  );
};
