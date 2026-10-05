import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, includeIgnoreFile } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// https://eslint.org/docs/latest/use/configure/ignore#include-gitignore-files
const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  stylistic.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
])
