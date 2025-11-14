import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import next from '@next/eslint-plugin-next'

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      '.cache/**',
      'public/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        URLSearchParams: 'readonly',
        
        // HTML Element types
        HTMLElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLDivElement: 'readonly',
        
        // Browser APIs
        MouseEvent: 'readonly',
        Node: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        NodeJS: 'readonly',
        
        // TypeScript
        React: 'readonly',
        Action: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': react,
      'react-hooks': reactHooks,
      '@next/next': next
    },
    rules: {
      // Turn off strict rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'off',
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-img-element': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-useless-escape': 'warn',
      'no-constant-condition': 'warn',
      'no-case-declarations': 'warn',
      'no-irregular-whitespace': 'warn'
    }
  }
]