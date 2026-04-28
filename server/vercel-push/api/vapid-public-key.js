import { handleOptions, setCors } from "./_lib/cors.js";

export default function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);

  if (!process.env.VAPID_PUBLIC_KEY) {
    res.status(500).json({ error: "VAPID_PUBLIC_KEY is not configured" });
    return;
  }

  res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}
