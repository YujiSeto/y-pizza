import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme/theme-toggle";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { CartButton } from "../cart/cart-button";

export const Header = () => {
  return (
    <header className="flex my-4 p-5 items-center justify-between bg-secondary rounded-md">
      <Link href="/">
        <div className="text-2xl font-bold flex gap-2">
          <Image src="/logo.svg" alt="Y Pizza" width={30} height={30} />Y Pizza
        </div>
      </Link>
      <div className="flex gap-2">
        <Button>
          <LogIn /> <span className="hidden md:inline">Login / Register</span>
        </Button>
        <CartButton />
        <ThemeToggle />
      </div>
    </header>
  );
};
