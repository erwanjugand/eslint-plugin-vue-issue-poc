# `vue/no-ref-as-operand` false positive on `refManualReset().reset()`

Minimal reproduction for [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue): with type-aware linting, [`vue/no-ref-as-operand`](https://eslint.vuejs.org/rules/no-ref-as-operand.html) reports the `reset()` method of a VueUse [`refManualReset`](https://vueuse.org/shared/refManualReset/) ref.

## Steps

```sh
npm install
npm run lint
```

## Actual

```
src/App.vue
  9:1  error  Must use `.value` to read or write the value of a ref  vue/no-ref-as-operand
```

`eslint --fix` rewrites `message.reset()` to `message.value.reset()`, which throws at runtime: `TypeError: message.value.reset is not a function`.

## Expected

No error. `message.reset()` is valid: `refManualReset()` returns a ref that has its own `reset` method.

```ts
interface ManualResetRefReturn<T> extends Ref<T> {
  reset: Fn
}
```

## Details

- Regression in `eslint-plugin-vue@10.12.0`. Version `10.11.1` reports no error on the same code.
- Happens only with type-aware linting (`parserOptions.projectService: true`). Without type information, no error is reported.
- Cause: 10.12.0 added `isRefObjectType()` (`lib/utils/ts-utils/ts-types.js`). It matches every type that has a `RefSymbol` property, so it also matches types that extend `Ref<T>`. The `MemberExpression>Identifier` handler in `lib/rules/no-ref-as-operand.ts` then reports every property except `value` and `effect`.
- Possible fix: in the type-based check, do not report a property that exists on the ref type.

## Versions

- eslint 10.14.0
- eslint-plugin-vue 10.12.0
- @typescript-eslint/parser 8.72.1
- typescript 6.0.3
- @vueuse/core 15.0.0
- vue 3.5.44
- Node.js 26.13.0
