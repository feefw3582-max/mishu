import { kv } from "@vercel/kv";
import webpush from "web-push";
import { buildPushPayload, dueSlots } from "./_lib/plan.js";

function configureWebPush() {
  const subject = process.env.VAPID_SUBJECT || "mailto:raymond@example.com";
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be configured");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

async function sendToAll(slot) {
  let sent = 0;
  let removed = 0;
  const payload = buildPushPayload(slot);

  for await (const key of kv.scanIterator({ match: "subscription:*" })) {
    const record = await kv.get(key);
    if (!record || !record.subscription) continue;

    try {
      await webpush.sendNotification(record.subscription, payload);
      sent += 1;
    } catch (error) {
      const statusCode = error.statusCode || error.status;
      if (statusCode === 404 || statusCode === 410) {
        await kv.del(key);
        removed += 1;
      } else {
        console.error("push failed", key, statusCode, error.body || error.message);
      }
    }
  }

  return { slot: slot.time, title: slot.title, sent, removed };
}

export default async function handler(req, res) {
  const configuredSecret = process.env.CRON_SECRET;
  if (configuredSecret && req.headers.authorization !== `Bearer ${configuredSecret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  configureWebPush();
  const slots = dueSlots(new Date(), 5);
  const results = [];

  for (const slot of slots) {
    results.push(await sendToAll(slot));
  }

  res.status(200).json({ ok: true, checkedAt: new Date().toISOString(), results });
}
