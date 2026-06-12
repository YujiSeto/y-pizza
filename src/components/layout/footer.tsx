import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer>
      <Separator />
      <div className="my-5 text-center text-sm opacity-50">
        Powered by{" "}
        <a
          href="https://yujiseto.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:opacity-100 transition-opacity"
        >
          YujiSeto
        </a>
      </div>
    </footer>
  );
};
