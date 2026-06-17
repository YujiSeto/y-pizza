"use client";

import { useState } from "react";
import { CustomInput } from "../layout/custom-input";
import { Button } from "../ui/button";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/axios";

const schema = z.object({
  email: z.string().email(),
});

type Props = {
  onValidate: (hasEmail: boolean, email: string) => void;
};

export const LoginAreaStepEmail = ({ onValidate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [emailField, setEmailField] = useState("");

  const handleButton = async () => {
    setErrors(null);
    const validData = schema.safeParse({
      email: emailField,
    });

    if (!validData.success) {
      setErrors(validData.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const emailReq = await api.post("/auth/validate_email", {
        email: validData.data.email,
      });
      console.log("API response:", emailReq.data);
      setLoading(false);
      onValidate(emailReq.data.exists ? true : false, validData.data.email);
    } catch (err) {
      console.error("API error:", err);
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
      <div className="">
        <p className="mb-2 text-base">Please enter your email address</p>

        <CustomInput
          name="email"
          type="email"
          errors={errors}
          value={emailField}
          disabled={loading}
          onChange={(e) => {
            setEmailField(e.target.value);
          }}
        />

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
      </div>
    </form>
  );
};
