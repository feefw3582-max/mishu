import { kv } from "@vercel/kv";
import webpush from "web-push";
import { handleOptions, setCors } from "./_lib/cors.js";

function configureWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:raymond@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  configureWebPush();
  const payload = JSON.stringify({
    title: "Raymond 服务端推送测试",
    body: "这条通知来自服务端，不依赖iPhone网页APP后台存活。",
    tag: "raymond-server-test",
    url: "/mishu/#decision",
  });

  let sent = 0;
  for await (const key of kv.scanIterator({ match: "subscription:*" })) {
    const record = await kv.get(key);
    if (!record || !record.subscription) continue;
    await webpush.sendNotification(record.subscription, payload);
    sent += 1;
  }

  res.status(200).json({ ok: true, sent });
}
