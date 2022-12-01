const commonOptions = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "react/jsx-one-expression-per-line": "off",
    // Why would you want unused vars?
    "@typescript-eslint/no-unused-vars": ["error"],
    // This rule is not compatible with Next.js"s <Link /> components
    "jsx-a11y/anchor-is-valid": "off",
    // We will use TypeScript"s types for component props instead
    "react/prop-types": "off",
    // NextJs specific fix: suppress errors for missing "import React" in files for nextjs
    "react/react-in-jsx-scope": "off",
    // NextJs specific fix: allow jsx syntax in js files
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "react/display-name": 1,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    // https://github.com/typescript-eslint/typescript-eslint/issues/2540#issuecomment-692505191
    "no-use-before-define": "off",
    "no-undef": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    // quotes are sometimes used for text in jsx
    "react/no-unescaped-entities": "off",
  },
};

function getExtends(extras = []) {
  return [
    "eslint:recommended",
    ...extras,
    "airbnb",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",

    "prettier",  // use prettier to format code
  ];
}

module.exports = {
  ignorePatterns: ["node_modules/*", ".next/*", ".out/*", "!.prettierrc.js"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // enable linting for jsx files
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  extends: getExtends([]),
  ...commonOptions,
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: getExtends(["plugin:@typescript-eslint/recommended"]),
      ...commonOptions,
    },
  ],
};
