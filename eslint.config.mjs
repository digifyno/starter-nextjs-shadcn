import { fixupConfigRules } from '@eslint/compat';
import nextConfig from 'eslint-config-next/core-web-vitals';
import tsConfig from 'eslint-config-next/typescript';

const eslintConfig = [
  ...fixupConfigRules(nextConfig),
  ...fixupConfigRules(tsConfig),
];

export default eslintConfig;
