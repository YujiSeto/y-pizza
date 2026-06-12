"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

export const CartButton = () => {
  const cart = useCart();

  return (
    <Button onClick={() => cart.setOpen(true)}>
      <ShoppingCart /> <span className="hidden md:inline">Cart</span>
    </Button>
  );
};
