import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  // Ignorer les fichiers générés
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts']
  },

  // Configuration de base JavaScript
  js.configs.recommended,

  // Configuration Vue 3
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
      }
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      // Règles Vue personnalisées
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': ['error', {
        html: { void: 'always', normal: 'never', component: 'always' }
      }]
    }
  },

  // Configuration TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      // Règles TypeScript personnalisées
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off'
    }
  },

  // Règles générales
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Géré par TypeScript
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
]
