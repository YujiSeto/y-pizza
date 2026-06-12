"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { ShoppingCart, X } from "lucide-react";

export const CartEmpty = () => {
  const { setOpen } = useCart();
  return (
    <div className="my-10 text-center">
      <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground" />
      <h1 className="text-xl mb-2">Your cart is empty</h1>
      <p className="mb-4 text-muted-foreground">
        Add some pizzas to your cart to get started
      </p>
      <Button onClick={() => setOpen(false)}>
        <X size={16} /> Close
      </Button>
    </div>
  );
};
