import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === "development") {
    try {
      const moduleName = "lovable-tagger";
      const { componentTagger } = await import(moduleName);
      plugins.push(componentTagger());
    } catch {
      // Optional dev-only plugin; continue when not installed.
    }
  }

  return {
    base: './',
    server: {
      host: "::",
      port: 8080,
      // Workspace preview hosts (see repo environment). Vite blocks unknown
      // Host headers by default, which breaks proxied preview URLs.
      allowedHosts: [".prod-runtime.all-hands.dev"],
      hmr: {
        overlay: false,
      },
    },
    plugins,
    assetsInclude: ["**/*.PNG", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
