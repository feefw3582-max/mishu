const CACHE_NAME = "raymond-plan-pwa-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "SHOW_REMINDER") return;
  const { title, body, tag } = event.data.payload;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: tag || "raymond-current-task",
      icon: "./icon.svg",
      badge: "./icon.svg",
      vibrate: [120, 80, 120],
      data: { url: "./" },
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Raymond，现在要做啥";
  const body = data.body || "打开看板，按当前时间块执行 P0-P3。";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: data.tag || "raymond-server-push",
      icon: "./icon.svg",
      badge: "./icon.svg",
      data: { url: data.url || "./" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "./";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
