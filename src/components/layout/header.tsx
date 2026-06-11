"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="container mx-auto flex my-4 p-5 items-center justify-between bg-secondary rounded-md">
      <Link href="/">
        <div className="text-2xl font-bold flex gap-2">
          <Image src="/logo.svg" alt="Y Pizza" width={30} height={30} />Y Pizza
        </div>
      </Link>
      <div className="flex gap-2">
        <Button>Login / Register</Button>
        <Button>Cart</Button>
        <ThemeToggle />
      </div>
    </header>
  );
};
