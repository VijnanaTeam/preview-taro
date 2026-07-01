# H5 dev server 的两个坑

浏览器预览用 `pnpm run dev:h5`（= `taro build --type h5 --watch`，会起 webpack-dev-server，
默认端口 **10086**）。首次跑会踩到两个坑：

## 坑 1：缺 fast-refresh 依赖
dev 模式（非 build）需要热更新插件，否则启动即报
`Cannot find module '@pmmmwh/react-refresh-webpack-plugin'`。
生产 `build:h5` 不需要，所以容易漏。

```bash
pnpm add -D @pmmmwh/react-refresh-webpack-plugin@0.5.11 react-refresh@0.14.0
```

## 坑 2：Taro H5 不生成入口 index.html
Taro 的 H5 target **不产出** `index.html`，dev server 把输出目录挂在 `/` 并用
serveIndex 列目录 —— 于是 `/` 只显示目录列表，app 不挂载。
（其 `historyApiFallback` 强制把所有路由 rewrite 到 `/`，就是期望那里有个 index.html。）

### 解决
仓库内提供 `public/index.html` 作宿主页，加载内存中的 dev 包（顺序要对）：
```html
<div id="app"></div>
<script src="/runtime.js"></script>
<script src="/taro.js"></script>
<script src="/app.js"></script>
```
并在 `config/index.js` 里把 dev server 的 static 指向 `public/`：
```js
h5: {
  router: { mode: 'hash' },
  devServer: {
    host: 'localhost', port: 10086, open: false,
    static: [{ directory: path.join(__dirname, '..', 'public'), publicPath: '/', watch: false }]
  }
}
```
- bundle（runtime/taro/app.js）由 devMiddleware 从内存出，static 只负责 `/` 的 index.html，二者不冲突。
- `static` 要给**数组**形态 `[{...}]`，跟 Taro 默认结构一致，object 形态会被 merge 成两个 static 源、仍列空目录。

## 验证
`curl -s http://localhost:10086/ | grep title` → `<title>泊车票</title>`；
浏览器打开 http://localhost:10086/ 自动跳 `#/pages/index/index`。
