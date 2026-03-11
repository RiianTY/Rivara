import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Link } from "@/components/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { ContactButton } from "@/components/contact-button";
import { Logo } from "@/components/icons";

interface NavbarProps {
  maxWidth?: "xl" | "2xl" | "full";
  position?: "static" | "sticky" | "fixed";
  className?: string;
}

interface NavbarItemProps {
  className?: string;
  children: React.ReactNode;
}

interface NavbarBrandProps {
  className?: string;
  children: React.ReactNode;
}

interface NavbarMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
}

interface NavbarMenuItemProps {
  children: React.ReactNode;
}

const NavbarItem = ({ className, children }: NavbarItemProps) => {
  return <div className={clsx("flex items-center", className)}>{children}</div>;
};

const NavbarBrand = ({ className, children }: NavbarBrandProps) => {
  return <div className={clsx("flex items-center", className)}>{children}</div>;
};

interface NavbarMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NavbarMenuToggle = ({ isOpen, onToggle }: NavbarMenuToggleProps) => {
  return (
    <button
      aria-label="Toggle menu"
      className="sm:hidden p-2 rounded-lg hover:bg-default-100 transition-colors -mr-1"
      type="button"
      onClick={onToggle}
    >
      {isOpen ? (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      )}
    </button>
  );
};

const NavbarMenu = ({ isOpen, children }: NavbarMenuProps) => {
  return (
    <div
      className={clsx(
        "sm:hidden absolute top-full left-0 right-0 z-40",
        "overflow-hidden transition-all duration-300 ease-out",
        "rounded-b-2xl",
        "bg-white/70 dark:bg-black/50 backdrop-blur-xl",
        "border-x border-b border-black/10 dark:border-white/10 shadow-lg",
        isOpen
          ? "max-h-[500px] opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none",
      )}
    >
      {children}
    </div>
  );
};

const NavbarMenuItem = ({ children }: NavbarMenuItemProps) => {
  return <div className="w-full">{children}</div>;
};

export const Navbar = ({ maxWidth = "xl", className }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const maxWidthClass = {
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  }[maxWidth];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getScrollY = () =>
      window.scrollY ?? document.documentElement.scrollTop ?? 0;

    const handleScroll = () => {
      setIsMenuOpen(false);
      const currentY = getScrollY();
      const lastY = lastScrollYRef.current;

      if (currentY <= 10) {
        setIsVisible(true);
        lastScrollYRef.current = currentY;

        return;
      }

      if (currentY > lastY) {
        setIsVisible(false);
      } else if (currentY < lastY) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    const handleWheel = (event: WheelEvent) => {
      setIsMenuOpen(false);
      if (event.deltaY < 0) {
        setIsVisible(true);
      } else if (event.deltaY > 0) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    lastScrollYRef.current = getScrollY();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      className={clsx(
        "sticky top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4",
        "transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full",
        className,
      )}
    >
      <div className="relative w-full max-w-4xl">
        <nav
          className={clsx(
            "flex w-full transition-[border-radius] duration-300",
            isMenuOpen ? "rounded-t-2xl" : "rounded-2xl",
            "bg-white/70 dark:bg-black/50 backdrop-blur-xl",
            "border border-black/10 dark:border-white/10 shadow-lg",
          )}
        >
          <div
            className={clsx(
              "w-full mx-auto px-4 sm:px-6 lg:px-8",
              maxWidthClass,
            )}
          >
            <div className="flex items-center h-14 sm:h-16">
              {/* Logo — left */}
              <NavbarBrand className="flex-none">
                <Link
                  disableActiveStyle
                  className="flex items-center gap-1"
                  color="foreground"
                  to="/"
                >
                  <Logo />
                  <p className="font-bold text-inherit">Rivara</p>
                </Link>
              </NavbarBrand>

              {/* Links — center */}
              <div className="hidden sm:flex flex-1 justify-center gap-4">
                {siteConfig.navItems.map((item) => (
                  <NavbarItem key={item.href}>
                    <Link
                      className={clsx(
                        "text-foreground hover:text-[#00b7fa] transition-colors",
                        "data-[active=true]:text-[#00b7fa] data-[active=true]:font-medium",
                      )}
                      color="foreground"
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  </NavbarItem>
                ))}
              </div>

              {/* Actions — right */}
              <div className="flex-none flex items-center gap-3 ml-auto">
                <ThemeSwitch />
                <div className="hidden sm:block">
                  <ContactButton variant="nav" />
                </div>
                <NavbarMenuToggle
                  isOpen={isMenuOpen}
                  onToggle={() => setIsMenuOpen(!isMenuOpen)}
                />
              </div>
            </div>
          </div>
        </nav>

        <NavbarMenu isOpen={isMenuOpen}>
          <div className="mx-4 mt-1 mb-3 flex flex-col gap-2 pt-3">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={item.href}>
                <Link
                  className={clsx(
                    "block w-full text-center py-2 px-4 rounded-xl border border-black/10 dark:border-white/10 font-semibold leading-6",
                    "text-foreground hover:text-[#00b7fa] transition-colors",
                    "data-[active=true]:text-[#00b7fa] data-[active=true]:border-2 data-[active=true]:border-[#00b7fa] data-[active=true]:font-medium",
                  )}
                  color={
                    index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                  }
                  size="lg"
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
            <NavbarMenuItem>
              <ContactButton
                variant="nav"
                onClick={() => setIsMenuOpen(false)}
              />
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </div>
    </div>
  );
};
