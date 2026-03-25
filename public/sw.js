const CACHE_NAME = "habit-buckets-v2"
const APP_SHELL = ["/", "/login", "/signup", "/manifest.webmanifest"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return
  }

  const requestUrl = new URL(event.request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone()

          if (response.ok) {
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
          }

          return response
        })
        .catch(async () => {
          const cachedNavigation = await caches.match(event.request)

          if (cachedNavigation) {
            return cachedNavigation
          }

          const cachedLogin = await caches.match("/login")

          if (cachedLogin) {
            return cachedLogin
          }

          return new Response("Offline", { status: 503, statusText: "Offline" })
        })
    )

    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone()

          if (response.ok) {
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
          }

          return response
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/login")
          }

          return new Response("Offline", { status: 503, statusText: "Offline" })
        })
    })
  )
})
