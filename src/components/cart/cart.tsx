"use client";

import { ShoppingCart } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { useCart } from "@/stores/cart";
import { useEffect, useState } from "react";
import { CartEmpty } from "./cart-empty";
import { CartList } from "./cart-list";

export const Cart = () => {
  const cart = useCart();

  const [open, setOpen] = useState(cart.open);
  useEffect(() => {
    setOpen(cart.open);
  }, [cart]);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-4">
        <DrawerTitle className="flex gap-2">
          <ShoppingCart /> <span>Cart</span>
        </DrawerTitle>
        {cart.items.length <= 0 && <CartEmpty />}
        {cart.items.length > 0 && <CartList />}
      </DrawerContent>
    </Drawer>
  );
};
