"use client";

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";
import { useProducts } from "@/stores/products";
import { useEffect, useState } from "react";
import { CartProduct } from "./cart-product";
import { decimalToMoney } from "@/lib/utils";
import {
  CheckCircle,
  DollarSign,
  LogInIcon,
  Receipt,
  Truck,
} from "lucide-react";
import { useAuth } from "@/stores/auth";

export const CartList = () => {
  const auth = useAuth();
  const cart = useCart();
  const products = useProducts();

  const [subtotal, setSubtotal] = useState(0);
  const [shipingCost, setShipingCost] = useState(5);

  const calculateSubtotal = () => {
    let sub = 0;
    for (const item of cart.items) {
      const product = products.products.find((p) => p.id === item.productId);
      if (product) {
        sub += item.quantity * parseFloat(product.price.toString());
      }
    }
    setSubtotal(sub);
  };
  useEffect(calculateSubtotal, [cart]);

  return (
    <>
      <div className="flex flex-col gap-3 my-5">
        {cart.items.map((item) => (
          <CartProduct key={item.productId} data={item} />
        ))}
      </div>
      <div className="my-4 space-y-2 border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Receipt size={16} /> SubTotal
          </span>
          <span className="w-24 text-right">{decimalToMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Truck size={16} /> Shipping
          </span>
          <span className="w-24 text-right">{decimalToMoney(shipingCost)}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
          <span className="flex items-center gap-2">
            <DollarSign size={18} /> Total
          </span>
          <span className="w-24 text-right">
            {decimalToMoney(subtotal + shipingCost)}
          </span>
        </div>
      </div>

      {auth.token && (
        <Button className="w-full">
          <CheckCircle size={16} /> Finish Order
        </Button>
      )}
      {!auth.token && (
        <Button className="w-full" onClick={() => auth.setOpen(true)}>
          <LogInIcon size={16} /> Login to Finish Order
        </Button>
      )}
    </>
  );
};
