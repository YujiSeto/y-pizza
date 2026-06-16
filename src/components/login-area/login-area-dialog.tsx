"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAuth } from "@/stores/auth";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

type Steps = "EMAIL" | "SIGNUP" | "SIGNIN";

export const LoginAreaDialog = () => {
  const auth = useAuth();

  const [step, setStep] = useState<Steps>("EMAIL");

  return (
    <Dialog open={auth.open} onOpenChange={auth.setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== "EMAIL" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("EMAIL")}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}
            {step === "EMAIL" && "Login / Register"}
            {step === "SIGNUP" && "Sign up"}
            {step === "SIGNIN" && "Login"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {step === "EMAIL" && (
            <div className="">
              Email
            </div>
          )}
          {step === "SIGNUP" && (
            <div className="">
              SignUp
            </div>
          )}
          {step === "SIGNIN" && (
            <div className="">
              SignIn
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
