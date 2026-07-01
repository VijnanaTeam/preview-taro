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
用 pnpm `overrides` 锁定 webpack。**注意配置位置随 pnpm 版本不同**：
- pnpm 10.10+/**11**：写在 **`pnpm-workspace.yaml`**（package.json 的 `"pnpm"` 字段已不再被读取，会 WARN）
- 旧版 pnpm：写在 `package.json` 的 `"pnpm"` 字段

本仓库用 `pnpm-workspace.yaml`：
```yaml
overrides:
  webpack: 5.78.0
onlyBuiltDependencies:
  - '@swc/core'
  - '@tarojs/binding'
  - core-js
  - core-js-pure
  - esbuild
  - swiper
```
改完后必须 **删掉 lockfile + node_modules 重装** 才会生效（只改 override 不重装，
pnpm 仍沿用旧解析）：
```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```
验证：`node -e "console.log(require('./node_modules/webpack/package.json').version)"` → 5.78.0

## 相关
- 原生依赖（`@tarojs/binding` / `@swc/core` / `esbuild` / `core-js` / `swiper`）的
  build script 默认被 pnpm 拦截。用 `onlyBuiltDependencies`（同样在 `pnpm-workspace.yaml`）
  声明式放行，**不要**用交互式 `pnpm approve-builds`（会卡住）。

## pnpm 11 供应链策略：MINIMUM_RELEASE_AGE_VIOLATION
某些环境（pnpm 11 + 全局/容器配置）开启了 `minimumReleaseAge`，拒绝「发布时间太近」的包。
本仓库 lockfile 里的间接依赖 `electron-to-chromium`（babel/browserslist 拉的，几乎每天更新）
常常太新而被拦，导致 `pnpm install` 中止回滚。
- 这是**安装环境的策略**，不是仓库问题；`pnpm clean --lockfile` 重解没用（会拉到更新的版本）。
- 解决：安装时临时关闭该检查 —— `pnpm install --config.minimumReleaseAge=0`
  （或在受控环境 `pnpm config set minimumReleaseAge 0`）。
