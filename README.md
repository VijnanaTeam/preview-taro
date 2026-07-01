# 泊车票 · 停车缴费小程序

基于 [Taro](https://github.com/NervJS/taro)（React 语法）开发的微信小程序 —— 一个**停车缴费**演示应用。所有数据均为前端 **mock**，仅做界面展示，无任何后端请求。

## 设计

「**泊车票 · Parking Stub**」—— 以停车票据为灵感的触感化界面：沥青深色底 + 信号黄路标点缀 + 新能源绿牌质感。核心亮点是一套**仿真中国车牌键盘**（省份简称 → 字母 → 字母/数字），以及带撕票齿孔的票据卡片。

## 交互流程

```
首页（输入车牌）
   │  点击「确定」
   ▼
缴费页（订单票据 · 费用明细 · 支付方式）
   │  点击「确认缴费」（模拟 0.9s 支付中）
   ▼
缴费成功（动画印章 · 小票）
   │  点击「返回首页」
   ▼
首页（重置）
```

- 车牌满 7 位显示蓝色燃油牌，满 8 位自动切换为绿色新能源牌。
- 停车场、时长、金额等由车牌号**确定性地**生成（同一车牌结果一致），纯前端 mock，见 `src/utils/mock.ts`。

## 目录

```
src/
├─ app.config.ts        # 页面注册 & 全局窗口样式
├─ app.scss             # 全局主题 token（颜色 / 字体）
├─ utils/mock.ts        # mock 数据 & 跨页订单存储
└─ pages/
   ├─ index/            # 首页：车牌输入 + 自定义车牌键盘
   ├─ payment/          # 缴费页：票据 + 费用明细 + 支付方式
   └─ success/          # 缴费成功页
```

## 运行（微信小程序）

```bash
pnpm install
pnpm run build:weapp      # 或 pnpm run dev:weapp 监听构建
```

用**微信开发者工具**导入本项目根目录（`project.config.json` 已指向 `dist/`），即可预览。测试 AppID 为 `touristappid`。

## 浏览器预览 / dev server（可选，仅用于快速查看 UI）

项目同时支持 H5，带热更新的 dev server 便于在普通浏览器中实时预览：

```bash
pnpm run dev:h5          # 启动 H5 dev server（热更新）
# 打开 http://localhost:10086/
```

> 说明：Taro 的 H5 目标不会生成入口 `index.html`，因此仓库内提供了 `public/index.html`
> 作为宿主页（加载内存中的 dev 包 `runtime.js` / `taro.js` / `app.js`），并在
> `config/index.js` 的 `h5.devServer.static` 中指向 `public/`。H5 仅为附带的预览手段；
> 实际交付目标为微信小程序（`build:weapp`）。

## 技术说明

- `package.json` 中通过 pnpm `overrides` 将 `webpack` 锁定为 `5.78.0`，以匹配 Taro 3.6.34 运行时（新版 webpack 的 ProgressPlugin schema 更严格，会导致构建失败）。
- 主题 token 同时挂在 `page` 与 `.page` 上，保证在小程序与 H5 两种环境下 CSS 变量都能被子元素继承。
