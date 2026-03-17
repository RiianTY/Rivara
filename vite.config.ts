import type { Plugin } from "vite";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Plugin to inline critical CSS, defer main CSS, and optimize resource loading
function cssOptimizationPlugin(): Plugin {
  return {
    name: "css-optimization",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        // Inline critical CSS (minified) - CSS variables and base styles
        const criticalCSS = `:root{--background:0 0% 100%;--foreground:0 0% 3.9%;--primary:262.1 83.3% 57.8%;--primary-foreground:210 20% 98%;--danger:0 72.2% 50.6%;--danger-foreground:0 0% 98%;--default:0 0% 98%;--default-foreground:0 0% 9%;--default-50:0 0% 98%;--default-100:0 0% 96.1%;--default-200:0 0% 89.8%;--default-300:0 0% 83.1%;--default-400:0 0% 63.9%;--default-500:0 0% 45.1%;--default-600:0 0% 32.2%;--default-700:0 0% 23.1%;--default-800:0 0% 14.9%;--default-900:0 0% 9%;--divider:0 0% 89.8%}.dark{--background:0 0% 0%;--foreground:0 0% 98%;--primary:263.4 70% 50.4%;--primary-foreground:210 20% 98%;--danger:0 62.8% 30.6%;--danger-foreground:0 0% 98%;--default:0 0% 9%;--default-foreground:0 0% 98%;--default-50:0 0% 9%;--default-100:0 0% 14.9%;--default-200:0 0% 23.1%;--default-300:0 0% 32.2%;--default-400:0 0% 45.1%;--default-500:0 0% 63.9%;--default-600:0 0% 83.1%;--default-700:0 0% 89.8%;--default-800:0 0% 96.1%;--default-900:0 0% 98%;--divider:0 0% 14.9%}html{background-color:hsl(var(--background));color:hsl(var(--foreground))}body{background-color:hsl(var(--background));color:hsl(var(--foreground));margin:0;padding:0;min-height:100vh}#root{background-color:hsl(var(--background));min-height:100vh}`;

        // Insert critical CSS in head
        html = html.replace(
          "</head>",
          `    <style id="critical-css">${criticalCSS}</style>\n  </head>`,
        );

        // Convert stylesheet links to preload + async load
        html = html.replace(
          /<link([^>]*rel=["']stylesheet["'][^>]*)>/gi,
          (match, attrs) => {
            const hrefMatch = attrs.match(/href=["']([^"']+)["']/);

            if (!hrefMatch) return match;

            const href = hrefMatch[1];

            // Use preload with onload to make it non-blocking
            return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
          },
        );

        // Preload critical JavaScript chunks (main entry point)
        html = html.replace(
          /<script([^>]*type=["']module["'][^>]*)>/gi,
          (match, attrs) => {
            const srcMatch = attrs.match(/src=["']([^"']+)["']/);

            if (srcMatch) {
              const src = srcMatch[1];
              // Add preload for the main entry script
              const preload = `<link rel="modulepreload" href="${src}">`;

              return preload + match;
            }

            return match;
          },
        );

        return html;
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), cssOptimizationPlugin()],
  build: {
    cssCodeSplit: true,
    cssMinify: true,
    minify: "esbuild",
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "vendor";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
            return; // main bundle
          }
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("lucide-react")) return "vendor-icons";

          return "vendor";
        },
        // Optimize chunk file names
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Enable chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  css: {
    devSourcemap: false,
  },
});
