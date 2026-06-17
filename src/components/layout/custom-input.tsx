import { ComponentProps } from "react";
import { Input } from "../ui/input";
import { checkFieldError } from "@/lib/utils";

type Props = ComponentProps<"input"> & {
  name: string;
  errors: any;
};

export const CustomInput = (props: Props) => {
  const error = checkFieldError(props.name, props.errors);

  return (
    <>
      <Input {...props} className={`${error ? "border-red-800" : ""}`} />
      {error && <p className="text-red-800 text-sm mt-1">{error}</p>}
    </>
  );
};
