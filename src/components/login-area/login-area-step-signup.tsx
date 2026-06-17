"use client";

import { useAuth } from "@/stores/auth";
import { useState } from "react";
import { z } from "zod";
import { CustomInput } from "../layout/custom-input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/axios";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Email is invalid"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type Props = {
  email: string;
};
export const LoginAreaStepSignUp = ({ email }: Props) => {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState(email);
  const [passwordField, setPasswordField] = useState("");
  const [passwordConfirmField, setPasswordConfirmField] = useState("");

  const handleButton = async () => {
    setErrors(null);

    const validData = schema.safeParse({
      name: nameField,
      email: emailField,
      password: passwordField,
      passwordConfirm: passwordConfirmField,
    });

    if (!validData.success) {
      setErrors(validData.error.flatten().fieldErrors);
      return false;
    }

    try {
      setLoading(true);
      const signUpReq = await api.post("/auth/signup", {
        name: validData.data.name,
        email: validData.data.email,
        password: validData.data.password,
      });
      if (!signUpReq.data.token) {
        alert(signUpReq.data.error);
      } else {
        auth.setToken(signUpReq.data.token);
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
        <p className="mb-2">Please enter your Name</p>
        <CustomInput
          name="name"
          value={nameField}
          errors={errors}
          disabled={loading}
          type="text"
          onChange={(e) => setNameField(e.target.value)}
          autoFocus
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
        />
      </div>
      <div>
        <p className="mb-2">Please confirm your Password</p>
        <CustomInput
          name="passwordConfirm"
          value={passwordConfirmField}
          onChange={(e) => setPasswordConfirmField(e.target.value)}
          errors={errors}
          disabled={loading}
          type="password"
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
