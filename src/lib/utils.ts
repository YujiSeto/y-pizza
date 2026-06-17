import { Prisma } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decimalToMoney = (price: string | number | Prisma.Decimal) => {
  return parseFloat(price.toString()).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const checkFieldError = (fieldName: string, errors: any) => {
  if (errors === null) return false;
  if (!errors[fieldName]) return false;
  return errors[fieldName][0];
};
