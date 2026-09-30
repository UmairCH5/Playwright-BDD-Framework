export default [
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'reports/**',
      '.features-gen/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
