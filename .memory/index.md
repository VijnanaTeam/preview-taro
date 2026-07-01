# 项目记忆 · 目录

> preview-taro —— 基于 Taro 的微信小程序「泊车票」停车缴费 demo。
> 本目录存放跨会话有用、且从代码/git 历史里看不出来（或排查过才知道）的信息。

## 索引

| 文档 | 摘要 |
|------|------|
| [project-overview.md](./project-overview.md) | 项目是什么、技术栈、仓库地址、交付目标 |
| [build-webpack-pitfall.md](./build-webpack-pitfall.md) | webpack 必须锁 5.78.0，否则 Taro 3.6.34 构建失败 |
| [h5-dev-server.md](./h5-dev-server.md) | H5 dev server 的两个坑：react-refresh 依赖 + 缺入口 index.html |
| [architecture.md](./architecture.md) | 页面结构、mock 数据层、主题 token 的跨端继承处理 |

## 约定

- 一个文档记一类事；新增文档记得回来更新本索引表。
- 记「非显而易见」的事：代码结构、已修复的常规 bug、git 能查到的历史不必记。
