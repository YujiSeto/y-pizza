"use client";

import { Product } from "@/generated/prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { decimalToMoney } from "@/lib/utils";
import { useCart } from "@/stores/cart";
import { CirclePlus } from "lucide-react";

type Props = {
  data: Product;
  index: number;
};

export const PizzaItem = ({ data, index }: Props) => {
  const cart = useCart();

  const handleAddToCart = () => {
    cart.addItem({
      productId: data.id,
      quantity: 1,
    });
    cart.setOpen(true);
  };
  return (
    <div className="text-sm bg-secondary p-4 rounded-md">
      <Image
        src={data.image}
        alt={data.name}
        width={200}
        height={200}
        className="w-full mb-3"
        loading={index === 0 ? "eager" : "lazy"}
      />
      <div className="text-lg font-bold truncate">{data.name}</div>
      <div className="">{decimalToMoney(data.price)}</div>
      <div className="truncate mb-3">{data.ingredients}</div>
      <div className="text-center">
        <Button onClick={handleAddToCart}>
          <CirclePlus size={16} /> Add to cart
        </Button>
      </div>
    </div>
  );
};
