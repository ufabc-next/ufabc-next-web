module.exports = {
  root: true,
  extends: ['custom', 'react-ts'],
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
