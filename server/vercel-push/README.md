# Raymond 服务端准点推送

这个目录是准点提醒后端模板。它解决的问题是：iPhone 杀掉网页APP后台后，前端定时器无法准点触发。真正可用的方案必须由服务端按时间发送 Web Push。

## 部署目标

- Vercel Serverless Functions
- Vercel Cron
- Vercel KV
- Web Push VAPID

## 环境变量

```text
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:your-email@example.com
ALLOWED_ORIGIN=https://feefw3582-max.github.io
CRON_SECRET=任意长随机字符串，可选
```

生成 VAPID key：

```bash
npm install
npm run vapid
```

## 前端配置

部署完成后，在网页APP的“我的 -> iPhone主屏和服务端推送”里填写：

- 推送服务端地址：例如 `https://your-project.vercel.app/api`
- VAPID公钥：`VAPID_PUBLIC_KEY`

然后点击“订阅服务端推送”。

## 定时策略

`vercel.json` 当前配置为每5分钟执行一次 `/api/cron`。服务端会检查香港时间当前5分钟窗口内是否命中计划时间点，命中则向所有订阅设备发送推送。

如果你需要更精确的分钟级提醒，把 `vercel.json` 的 cron 改成：

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "* * * * *"
    }
  ]
}
```

注意：具体最小频率取决于你的Vercel套餐。
