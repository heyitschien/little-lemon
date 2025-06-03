import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginReact from 'eslint-plugin-react';
import vitestPlugin from 'eslint-plugin-vitest';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules'] }, // Added node_modules to ignores
  {
    // General JS/JSX configuration
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react': eslintPluginReact,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest', // Using latest
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // Added node globals for general use if needed
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ new JSX transform
      'react/prop-types': 'off', // Disable if not using prop-types extensively
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Vitest configuration for test files
    files: ['**/*.{test,spec}.{js,jsx}'],
    plugins: {
      vitest: vitestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node, // Test files often need Node.js environment
        ...vitestPlugin.environments.env.globals, // Vitest globals
      },
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  // Add Prettier config last to override any conflicting rules
  eslintConfigPrettier,
];
