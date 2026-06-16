import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";

import { CartButton } from "../cart/cart-button";
import { LoginAreaButton } from "../login-area/login-area-button";
import { cookies } from "next/headers";

export const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <header className="flex my-4 p-5 items-center justify-between bg-secondary rounded-md">
      <Link href="/">
        <div className="text-2xl font-bold flex gap-2">
          <img src="/logo.svg" alt="Y Pizza" width={30} height={30} />Y Pizza
        </div>
      </Link>
      <div className="flex gap-2">
        <LoginAreaButton initialState={token ? true : false} />
        <CartButton />
        <ThemeToggle />
      </div>
    </header>
  );
};
