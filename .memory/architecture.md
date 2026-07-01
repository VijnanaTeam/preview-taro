# 架构要点

## 页面
`src/app.config.ts` 注册三页：
- `pages/index/index` —— 首页，车牌输入 + 自定义车牌键盘
- `pages/payment/index` —— 缴费页，票据 + 费用明细 + 支付方式
- `pages/success/index` —— 缴费成功页

## Mock 数据层 `src/utils/mock.ts`
- `buildOrder(plate)` 由车牌号**确定性**生成订单（同一车牌结果一致），用 FNV 风格
  hash 做种子，不依赖 `Date.now()`/`Math.random()`。
- 跨页传数据用模块级变量 `setOrder()` / `getOrder()`（纯前端 mock store），
  小程序/H5 单运行时内跨页导航都保持。
- 车牌满 7 位 = 蓝色燃油牌，满 8 位 = 绿色新能源牌（`detectNewEnergy`）。

## 主题 token 的跨端继承（重要）
CSS 变量若只定义在 `page {}` 上，在 **H5** 里子元素拿不到（`page` 不是所有内容的祖先），
会 fallback 成黑色等默认值。处理办法（`src/app.scss`）：用 SCSS `@mixin theme-tokens`
把所有 token 同时挂到 `page` **和** `.page`（每个页面根节点的 class）上，保证两端都能继承。

## 页面根节点用唯一修饰类
三页的根 View 都叫 `.page`，但各自有不同的背景/布局。在 H5 里所有页面 CSS 是**全局**的，
`.page` 规则会互相污染（比如成功页的绿色渐变背景漏到首页）。因此每页根节点加唯一修饰类：
`page--home` / `page--pay` / `page--done`，页面级的背景/布局写在修饰类上，共享 token 留在 `.page`。
（微信小程序里每页 wxss 是 scoped，不会污染；这条纯粹是为了 H5 预览正确。）
