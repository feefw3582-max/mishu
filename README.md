# raymond现在要做啥

一个纯前端执行计划网站。Raymond 输入当前日期和时间后，页面会按 P0-P3 输出现在该做的事情、目标和完成时间，并提供 2026 年 5-12 月总计划看板、三个 Agent 交付看板和今日复盘。

## 功能

- 时间决策器：匹配固定作息时间块，输出 P0-P3 当前行动。
- APP式底部导航：固定常驻，不随页面滚动消失。
- 多页切换：现在、今日OKR、本周OKR、阶段OKR、我的工作台。
- 工作日OKR确认看板：按日期保存 P0-P3 今日完成/未完成事项，打钩后自动进入已完成区。
- 每周OKR确认看板：按周一到周日保存本周完成/未完成事项，打钩后自动进入已完成区。
- 阶段看板：覆盖 5月10日、5月31日、6月7日、6月30日、7-12月节点。
- Agent 看板：拆解音乐生成、压力疏导、专注力恢复三个 Agent 的 MVP 与作品集表达。
- 本地持久化：勾选状态和复盘内容保存在浏览器 `localStorage`。
- PWA：支持添加到 iPhone 主屏幕、离线缓存和网页通知权限测试。
- 服务端推送模板：`server/vercel-push` 提供 Vercel Cron + Vercel KV + Web Push 模板，用来解决 iPhone 杀后台后前端无法准点定时的问题。
- 零依赖：只有 `index.html`、`styles.css`、`app.js`，可直接用 GitHub Pages 部署。

## iPhone 提醒说明

1. 用 iPhone Safari 打开 GitHub Pages 地址。
2. 点击分享按钮，选择“添加到主屏幕”。
3. 从主屏幕打开“Raymond待办”。
4. 点击页面里的“测试通知权限”，允许通知。
5. 如果需要准点提醒，部署 `server/vercel-push` 后在页面里填写服务端地址和 VAPID 公钥，再订阅服务端推送。

纯前端 GitHub Pages 不能可靠定时推送。iPhone 杀后台后，前端定时器会失效；准点提醒必须由服务端 Web Push 调度器发送。

## 本地打开

直接双击 `index.html`，或在目录中启动任意静态文件服务器。

```bash
python -m http.server 8080
```

## GitHub Pages

部署方式为 GitHub Pages 从仓库根目录读取静态文件：

- Branch: `main`
- Folder: `/`
