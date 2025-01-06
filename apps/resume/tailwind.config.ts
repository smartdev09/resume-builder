import baseConfig from "@resume/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",  // Covers all app directory files
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/ui/hooks/**/*.{ts,tsx}",
    "../../packages/ui/lib/**/*.{ts,tsx}"
  ],
  presets: [baseConfig],
  theme: {
    container: {
      center: true,
    },
  },
} satisfies Config;