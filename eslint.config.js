import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "deliverables/**",
      ".qa_energy_workbook/**",
      "backup-js-files/**",
      "engine/**",
      "pwa/**",
      "src-backup/**",
      "tests/**/*.js",
      "ui/**",
      "build_energy_model.mjs",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["eslint.config.js", "scripts/**/*.mjs", "public/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        caches: "readonly",
        clients: "readonly",
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
        self: "readonly",
        URL: "readonly",
      },
    },
  },
];
