import {defineConfig} from "eslint/config";
import globals from "globals";
import html from "eslint-plugin-html";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    js.configs.all,
    stylistic.configs.all,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jquery,
                d3: "readonly",
            },
            sourceType: "script",
        },
        plugins: {
            "@stylistic": stylistic,
            html,
        },
        rules: {
            "@stylistic/array-bracket-newline": ["error", "consistent"],
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/brace-style": ["error", "1tbs", {allowSingleLine: true}],
            "@stylistic/comma-dangle": ["error", "only-multiline"],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/function-call-argument-newline": "off",
            "@stylistic/indent-binary-ops": "off",
            "@stylistic/key-spacing": ["error", {multiLine: {mode: "minimum"}}],
            "@stylistic/multiline-comment-style": "off",
            "@stylistic/multiline-ternary": ["error", "always-multiline"],
            "@stylistic/newline-per-chained-call": ["error", {ignoreChainWithDepth: 5}],
            "@stylistic/no-extra-parens": ["error", "functions"],
            "@stylistic/no-multi-spaces": "off",
            "@stylistic/object-property-newline": ["error", {allowAllPropertiesOnSameLine: true}],
            "@stylistic/padded-blocks": "off",
            "@stylistic/quote-props": ["error", "consistent-as-needed"],
            "@stylistic/spaced-comment": ["error", "always", {block: {markers: ["!"]}}],

            "capitalized-comments": "off",
            "curly": ["error", "multi-line"],
            "func-names": "off",
            "func-style": "off",
            "id-length": ["error", {min: 1}],
            "max-lines": ["warn", 1000],
            "max-lines-per-function": ["warn", 900],
            "max-statements": ["warn", 55],
            "no-inline-comments": "off",
            "no-magic-numbers": "off",
            "no-negated-condition": "off",
            "no-ternary": "off",
            "no-var": "off",
            "one-var": "off",
            "prefer-arrow-callback": "off",
            "prefer-exponentiation-operator": "off",
            "prefer-template": "off",
            "sort-keys": "off",
            "vars-on-top": "off",
        },
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {ecmaVersion: 2020, sourceType: "module"},
        rules: {
            "sort-keys": "error",
        },
    },
]);
