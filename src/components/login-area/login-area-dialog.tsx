"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAuth } from "@/stores/auth";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { LoginAreaStepEmail } from "./login-area-step-email";
import { LoginAreaStepSignUp } from "./login-area-step-signup";
import { getCookie } from "cookies-next/client";
import { LoginAreaStepSignIn } from "./login-area-step-signin";

type Steps = "EMAIL" | "SIGNUP" | "SIGNIN";

export const LoginAreaDialog = () => {
  const auth = useAuth();

  const [step, setStep] = useState<Steps>("EMAIL");
  const [emailField, setEmailField] = useState("");

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      auth.setToken(token);
    }
  }, []);

  useEffect(() => {
    if (!auth.open) {
      setStep("EMAIL");
      setEmailField("");
    }
  }, [auth.open]);

  const handleStepEmail = (hasEmail: boolean, email: string) => {
    setEmailField(email);
    if (hasEmail) {
      setStep("SIGNIN");
    } else {
      setStep("SIGNUP");
    }
  };

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
            {step === "SIGNUP" && "Register"}
            {step === "SIGNIN" && "Login"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {step === "EMAIL" && (
            <LoginAreaStepEmail onValidate={handleStepEmail} />
          )}
          {step === "SIGNUP" && (
            <div className="">
              <LoginAreaStepSignUp email={emailField} />
            </div>
          )}
          {step === "SIGNIN" && (
            <div className="">
              <LoginAreaStepSignIn email={emailField} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
