# 项目概览

## 是什么
「泊车票」—— 停车缴费**演示**小程序。所有数据全部前端 mock，无后端请求，只做界面展示。

交互流程：
```
首页(输入车牌) → 确定 → 缴费页 → 确认缴费 → 缴费成功 → 返回首页
```

## 技术栈
- **Taro 3.6.34**（React 语法）→ 目标平台微信小程序（weapp）
- **pnpm** 管理依赖（用户明确要求，不用 npm/yarn）
- TypeScript + Sass

## 交付目标
- **实际交付 = 微信小程序**：`pnpm run build:weapp` → 用微信开发者工具导入项目根目录（`project.config.json` 已指向 `dist/`，测试 AppID `touristappid`）。
- H5 只是附带的浏览器预览手段，不是交付物。

## 仓库
- GitHub：https://github.com/VijnanaTeam/preview-taro （public，默认分支 `main`）
- 推送账号 `vfight`（gh CLI，已有 repo 权限）
- `.gitignore` 已排除 `node_modules/`、`dist/`

## 设计方向
「泊车票 · Parking Stub」票据触感风格：沥青深色底 + 信号黄路标点缀 + 新能源绿牌质感。
亮点是**仿真中国车牌键盘**（省份→字母→字母/数字三段式）和带撕票齿孔的票据卡片。
