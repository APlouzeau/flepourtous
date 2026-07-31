import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
    {
        ignores: [
            ".next/**",
            ".github/**",
            "node_modules/**",
            "next-env.d.ts",
            "prettier.config.mjs",
            "eslint.config.mjs",
            "postcss.config.mjs",
            "next.config.mjs",
            "ecosystem.js",
        ],
    },

    ...nextCoreWebVitals,
    ...nextTypescript,

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "react-refresh": reactRefresh,
            "unused-imports": unusedImports,
        },
        rules: {
            "react-refresh/only-export-components": [
                "warn",
                {
                    allowConstantExport: true,
                    allowExportNames: [
                        "metadata",
                        "generateMetadata",
                        "generateStaticParams",
                        "generateViewport",
                        "generateImageMetadata",
                        "alt",
                        "size",
                        "contentType",
                    ],
                },
            ],
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-deprecated": "error",
        },
    },
];

export default eslintConfig;