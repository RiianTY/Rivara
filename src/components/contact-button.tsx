import clsx from "clsx";
import { useTheme } from "next-themes";

import { Link } from "@/components/link";

const contactHref = "/contact";

interface ContactButtonProps {
  variant?: "default" | "nav";
  onClick?: () => void;
}

export function ContactButton({
  variant = "default",
  onClick,
}: ContactButtonProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isNav = variant === "nav";
  const button = (
    <button
      className={clsx(
        "relative group p-px font-semibold leading-6 cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-100 active:scale-95 border w-full",
        isDark
          ? "text-white bg-gray-800 border-white/20"
          : "text-black bg-white border-black/20",
      )}
      type="button"
    >
      <span
        className={clsx(
          "contact-glow-base",
          isDark ? "contact-glow-dark" : "contact-glow-light",
        )}
      />
      <span
        className={clsx(
          "relative z-10 flex items-center rounded-xl w-full justify-center",
          isDark ? "bg-black" : "bg-white",
          isNav ? "gap-1.5 px-4 py-2 sm:gap-2 sm:px-5 sm:py-2.5" : "px-6 py-3",
        )}
      >
        <span>Contact Us</span>
      </span>
    </button>
  );

  if (variant === "nav") {
    return (
      <Link className="block w-full" to={contactHref} onClick={onClick}>
        {button}
      </Link>
    );
  }

  return (
    <div className="flex justify-center w-full mt-[10px] pb-10 md:pb-0">
      <Link to={contactHref}>{button}</Link>
    </div>
  );
}
