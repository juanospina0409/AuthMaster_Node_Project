import globals from "globals";
// import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import unusedImports from "eslint-plugin-unused-imports"
import airbnbBase from "eslint-config-airbnb-base"
import airbnbBaseTypescript from "eslint-config-airbnb-base-typescript"
import { off } from "process";
// import { Extension } from "typescript";
/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recomended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      plugins: {
        "@typescript-eslint": tseslint,
        "unused-imports": unusedImports
      },
      rules: {
        ...airbnbBase.rules,
        ...airbnbBaseTypescript.rules,
        "no-unused-vars": off,
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
            caughtErrorIgnorePattern: "none"
          }
        ]
      },
      settings: {
        "import/resolver": {
          node: {
            extensions: [".js", "jsx", ".ts", ".tsx"]
          }
        }
      }
    }
  },
];