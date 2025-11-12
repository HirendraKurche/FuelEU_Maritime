import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
      build: {
        outDir: path.resolve(__dirname, "dist/public"),
        emptyOutDir: true,
        // Increase warning limit slightly and add manualChunks to split vendor code
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
          output: {
            manualChunks(id: string) {
              if (id.includes('node_modules')) {
                // Keep React and React-DOM together to avoid duplicate instances
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor.react';
                }
                if (id.includes('@tanstack')) return 'vendor.tanstack';
                if (id.includes('chart.js') || id.includes('recharts') || id.includes('d3')) return 'vendor.charts';
                if (id.includes('lodash')) return 'vendor.lodash';
                return 'vendor';
              }
            },
          },
        },
      },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
