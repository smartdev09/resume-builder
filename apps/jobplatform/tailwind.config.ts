import baseConfig from "@resume/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
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