import { describe, expect, it } from "vitest"

import {
  PWA_START_URL,
  createPwaManifest,
  shouldRegisterServiceWorker,
} from "@/lib/pwa/config"

describe("PWA config", () => {
  it("creates installable manifest config", () => {
    const manifest = createPwaManifest()

    expect(manifest.display).toBe("standalone")
    expect(manifest.start_url).toBe(PWA_START_URL)
    expect(manifest.icons).toHaveLength(2)
  })

  it("returns service worker capability in browser-like context", () => {
    expect(shouldRegisterServiceWorker({ hasWindow: true, hasServiceWorker: true })).toBe(true)
    expect(shouldRegisterServiceWorker({ hasWindow: true, hasServiceWorker: false })).toBe(false)
  })
})
