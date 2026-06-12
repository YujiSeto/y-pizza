"use client";

import { decimalToMoney } from "@/lib/utils";
import { useProducts } from "@/stores/products";
import { CartItem } from "@/types/cart-item";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { useCart } from "@/stores/cart";
import { Minus, Plus, Trash2 } from "lucide-react";

type Props = {
  data: CartItem;
};

export const CartProduct = ({ data }: Props) => {
  const [qt, setQt] = useState(data.quantity);
  const cart = useCart();
  const products = useProducts();
  let product = products.products.find((item) => item.id === data.productId);
  if (!product) return null;

  const handleMinusClick = () => {
    if (qt - 1 <= 0) {
      cart.removeItem(data.productId);
    } else {
      cart.addItem({ productId: data.productId, quantity: -1 });
    }
    setQt(qt - 1);
  };

  const handlePlusClick = () => {
    cart.addItem({ productId: data.productId, quantity: 1 });
    setQt(qt + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 rounded-md overflow-hidden">
        <Image
          width={100}
          height={100}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-md">{product.name}</div>
        <div className="text-xs text-muted-foreground">
          {decimalToMoney(product.price)}
        </div>
      </div>
      <div className="flex items-center bg-secondary p-2 rounded-md">
        <Button size="icon" variant="ghost" onClick={handleMinusClick}>
          {qt <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </Button>
        <div className="mx-3 w-6 text-center">{qt}</div>
        <Button size="icon" variant="ghost" onClick={handlePlusClick}>
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
};
