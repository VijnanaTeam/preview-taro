# 构建坑：webpack 必须锁 5.78.0

## 现象
`pnpm run build:weapp`（或任何 Taro 构建）报错：
```
ValidationError: Invalid options object. Progress Plugin has been initialized
using an options object that does not match the API schema.
```

## 原因
pnpm 默认会把 `webpack` 解析成最新的 5.108.x。新版 webpack 的 `ProgressPlugin`
options schema 更严格，而 Taro 3.6.34 的 webpack5-runner 传入的 progress 选项不符合，
导致构建直接失败。

## 解决
在 `package.json` 里用 pnpm `overrides` 锁定：
```json
"pnpm": {
  "overrides": { "webpack": "5.78.0" }
}
```
改完后必须 **删掉 lockfile + node_modules 重装** 才会生效（只改 override 不重装，
pnpm 仍沿用旧解析）：
```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```
验证：`node -e "console.log(require('./node_modules/webpack/package.json').version)"` → 5.78.0

## 相关
- 原生依赖（`@tarojs/binding` / `@swc/core` / `esbuild` / `core-js` / `swiper`）的
  build script 默认被 pnpm 拦截。用 `package.json` 的 `pnpm.onlyBuiltDependencies`
  声明式放行，**不要**用交互式 `pnpm approve-builds`（会卡住）。
