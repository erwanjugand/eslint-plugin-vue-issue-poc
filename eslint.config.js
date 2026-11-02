import pluginVue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'

export default [
  ...pluginVue.configs['flat/base'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        // Type-aware linting: needed to reproduce
        projectService: true,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/no-ref-as-operand': 'error',
    },
  },
]
