# raymond现在要做啥

一个纯前端执行计划网站。Raymond 输入当前日期和时间后，页面会按 P0-P3 输出现在该做的事情、目标和完成时间，并提供 2026 年 5-12 月总计划看板、三个 Agent 交付看板和今日复盘。

## 功能

- 时间决策器：匹配固定作息时间块，输出 P0-P3 当前行动。
- 阶段看板：覆盖 5月10日、5月31日、6月7日、6月30日、7-12月节点。
- Agent 看板：拆解音乐生成、压力疏导、专注力恢复三个 Agent 的 MVP 与作品集表达。
- 本地持久化：勾选状态和复盘内容保存在浏览器 `localStorage`。
- 零依赖：只有 `index.html`、`styles.css`、`app.js`，可直接用 GitHub Pages 部署。

## 本地打开

直接双击 `index.html`，或在目录中启动任意静态文件服务器。

```bash
python -m http.server 8080
```

## GitHub Pages

部署方式为 GitHub Pages 从仓库根目录读取静态文件：

- Branch: `main`
- Folder: `/`

