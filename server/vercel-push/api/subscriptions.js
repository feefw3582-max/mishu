import { kv } from "@vercel/kv";
import { createHash } from "node:crypto";
import { handleOptions, setCors } from "./_lib/cors.js";

function keyForSubscription(subscription) {
  return `subscription:${createHash("sha256").update(subscription.endpoint).digest("hex")}`;
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { subscription, timezone, plan } = req.body || {};
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    res.status(400).json({ error: "Invalid push subscription" });
    return;
  }

  const record = {
    subscription,
    timezone: timezone || "Asia/Hong_Kong",
    plan: plan || "raymond-2026-05-12",
    updatedAt: new Date().toISOString(),
  };

  await kv.set(keyForSubscription(subscription), record);
  res.status(200).json({ ok: true });
}
