import type { MetadataRoute } from "next"

export const PWA_APP_NAME = "Habit Buckets"
export const PWA_SHORT_NAME = "Buckets"
export const PWA_START_URL = "/dashboard"
export const PWA_THEME_COLOR = "#0f172a"
export const PWA_BACKGROUND_COLOR = "#f8fafc"

export function createPwaManifest(): MetadataRoute.Manifest {
  return {
    name: PWA_APP_NAME,
    short_name: PWA_SHORT_NAME,
    description: "A minimal daily habit tracker with bucket-based progress",
    start_url: PWA_START_URL,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: PWA_BACKGROUND_COLOR,
    theme_color: PWA_THEME_COLOR,
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}

export function shouldRegisterServiceWorker(input?: {
  hasWindow?: boolean
  hasServiceWorker?: boolean
}): boolean {
  const hasWindow = input?.hasWindow ?? typeof window !== "undefined"
  const hasServiceWorker = input?.hasServiceWorker ?? (typeof navigator !== "undefined" && "serviceWorker" in navigator)

  return hasWindow && hasServiceWorker
}
