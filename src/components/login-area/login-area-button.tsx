"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LogIn, ClipboardList, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/stores/auth";

type Props = {
  initialState: boolean;
};
export const LoginAreaButton = ({ initialState }: Props) => {
  const auth = useAuth();
  const [authState, setAuthState] = useState<boolean>(initialState);

  useEffect(() => {
    setAuthState(auth.token ? true : false);
  }, [auth]);

  const handleLogout = () => {
    auth.setToken(null);
    if (window.location.pathname === "/orders") {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  if (authState) {
    return (
      <>
        <Link href="/orders">
          <Button>
            <ClipboardList />
            <span className="hidden md:inline">My Orders</span>
          </Button>
        </Link>
        <Button onClick={handleLogout}>
          <LogOut />
          <span className="hidden md:inline">Log out</span>
        </Button>
      </>
    );
  } else
    return (
      <Button onClick={() => auth.setOpen(true)}>
        <LogIn />
        <span className="hidden md:inline">Login / Register</span>
      </Button>
    );
};
