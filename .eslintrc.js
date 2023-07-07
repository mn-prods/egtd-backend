module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    jsx: false
  },
  rules: {
    'max-len': [
      'error',
      {
        code: 130,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'no-throw-literal': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    //'@typescript-eslint/interface-name-prefix': ['warn', 'always'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  },
  extends: [
    'airbnb-base/legacy',
    'plugin:@typescript-eslint/recommended',
    // Disable ESLint rules that would conflict with prettier
    'prettier/@typescript-eslint',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended'
  ]
};
