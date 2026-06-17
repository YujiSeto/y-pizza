"use client";

import { useAuth } from "@/stores/auth";
import { useState } from "react";
import { z } from "zod";
import { CustomInput } from "../layout/custom-input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/axios";

const schema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type Props = {
  email: string;
};
export const LoginAreaStepSignIn = ({ email }: Props) => {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const [emailField, setEmailField] = useState(email);
  const [passwordField, setPasswordField] = useState("");

  const handleButton = async () => {
    setErrors(null);

    const validData = schema.safeParse({
      email: emailField,
      password: passwordField,
    });

    if (!validData.success) {
      setErrors(validData.error.flatten().fieldErrors);
      return false;
    }

    try {
      setLoading(true);
      const signInReq = await api.post("/auth/signin", {
        email: validData.data.email,
        password: validData.data.password,
      });
      if (!signInReq.data.token) {
        alert(signInReq.data.error);
      } else {
        auth.setToken(signInReq.data.token);
        auth.setOpen(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleButton();
      }}
    >
      <div>
        <p className="mb-2">Your Email</p>
        <CustomInput
          name="email"
          value={emailField}
          onChange={(e) => setEmailField(e.target.value)}
          errors={errors}
          disabled={true}
          type="email"
        />
      </div>
      <div>
        <p className="mb-2">Please enter your Password</p>
        <CustomInput
          name="password"
          value={passwordField}
          onChange={(e) => setPasswordField(e.target.value)}
          errors={errors}
          disabled={loading}
          type="password"
          autoFocus
        />
      </div>
      <Button className="w-full mt-5" disabled={loading} type="submit">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
};
