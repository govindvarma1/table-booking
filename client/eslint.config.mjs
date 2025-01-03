import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript",),
  {
    rules: {
      // Turn off warnings for unused variables (useful for development)
      "@typescript-eslint/no-unused-vars": "off",

      // Allow anonymous default exports (useful for quick prototyping)
      "import/no-anonymous-default-export": "off",

      // Disable the requirement for React display names in function components
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;


