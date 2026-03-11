import { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";

function FaviconThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const href = resolvedTheme === "dark" ? "/LogoWhite.png" : "/LogoBlack.png";
    const link =
      document.querySelector("link[rel=icon]") as HTMLLinkElement | null;
    if (link) link.href = href;
  }, [resolvedTheme]);

  return null;
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="system">
      <FaviconThemeSync />
      {children}
    </ThemeProvider>
  );
}
