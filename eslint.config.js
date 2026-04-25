import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const [tsTypeCheckedConfig, , tsTypeCheckedRules] = tseslint.configs.strictTypeChecked;

const typescriptConfig = {
	...tsTypeCheckedConfig,
	languageOptions: {
		...tsTypeCheckedConfig.languageOptions,
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
			},
			projectService: true,
		},
		globals: {
			...globals.browser,
			__VERSION__: 'readonly',
			__OPENAI_API_KEY__: 'readonly',
			__DEEPSEEK_API_KEY__: 'readonly',
			ImportMetaEnv: 'readonly',
		},
	},
	plugins: {
		'@stylistic': stylistic,
		'@typescript-eslint': tsPlugin,
		react,
	},
	rules: {
		...tsTypeCheckedRules.rules,

		// Rules that are turned off
		'react-hooks/set-state-in-effect': 'off',
		'@typescript-eslint/no-invalid-void-type': 'off',
		'no-useless-assignment': 'off',
		'no-undef': 'off',

		// Extra enabled rules
		'@stylistic/semi': ['error', 'always'],
		'@stylistic/quotes': ['error', 'single'],
		'@stylistic/indent': [
			'error',
			'tab',
			{
				SwitchCase: 0,
			},
		],
		'@stylistic/comma-dangle': ['error', 'always-multiline'],
		'@stylistic/object-curly-spacing': ['error', 'always'],
		'@stylistic/jsx-tag-spacing': [
			'error',
			{
				'closingSlash': 'never',
				'afterOpening': 'never',
				'beforeClosing': 'never',
			},
		],
		'@stylistic/jsx-curly-spacing': ['error', 'never'],
		'@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
		'@stylistic/jsx-equals-spacing': ['error', 'never'],
		'@stylistic/jsx-self-closing-comp': ['error', { component: true, html: true }],
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				'caughtErrors': 'none',
				'argsIgnorePattern': '^_$',
				'varsIgnorePattern': '^_$',
			},
		],
		'@typescript-eslint/naming-convention': [
			'warn',
			{
				selector: 'enumMember',
				format: ['UPPER_CASE'],
			},
		],
		'prefer-arrow-callback': 'error',
		'func-style': ['error', 'expression'],
		'jsx-quotes': ['error', 'prefer-single'],
		'consistent-return': 'error',
		'default-case-last': 'error',
		'eqeqeq': 'error',
		'no-else-return': 'error',
		'no-implicit-coercion': 'error',
		'no-useless-return': 'error',
		'prefer-const': 'error',
		'no-unreachable': 'error',
		'no-unused-expressions': 'error',
		'no-import-assign': 'error',
		'no-negated-condition': 'error',
		'react-refresh/only-export-components': [
			'error',
			{ 'allowConstantExport': true },
		],
		'max-lines-per-function': [
			'warn',
			{
				'max': 70,
				'skipBlankLines': true,
				'skipComments': true,
			},
		],
		'react/jsx-max-props-per-line': [
			'error',
			{
				'maximum': 1,
				'when': 'multiline',
			},
		],
		'react/jsx-boolean-value': ['error', 'never'],
		'react/jsx-curly-brace-presence': ['error', 'never'],
		'react/jsx-max-depth': ['warn', { 'max': 6 }],
		'react/no-unused-prop-types': 'warn',
		'curly': ['error', 'all'],
		'brace-style': [
			'warn',
			'1tbs',
			{ 'allowSingleLine': false },
		],
		'@typescript-eslint/no-use-before-define': 'error',
		'@typescript-eslint/no-confusing-void-expression': [
			'error',
			{ 'ignoreArrowShorthand': true },
		],
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{ 'allowNumber': true, allowBoolean: true },
		],
		'@typescript-eslint/no-unnecessary-condition': [
			'error',
			{
				'allowConstantLoopConditions': 'only-allowed-literals',
			},
		],
		'@typescript-eslint/strict-boolean-expressions': [
			'error',
			{
				'allowAny': true,
			},
		],
	},
};

export default defineConfig(
	eslint.configs.recommended,
	js.configs.recommended,
	reactRefresh.configs.vite,
	reactHooks.configs.flat.recommended,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	{
		files: ['**/*.ts'],
		...typescriptConfig,
		rules: {
			...typescriptConfig.rules,
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{ allowExpressions: true },
			],
		},
	},
	{
		ignores: ['node_modules/', 'dist/', '**/.pnp.cjs', '**/.pnp.loader.mjs', 'src/components/ui', '.yarn'],
	},
);
