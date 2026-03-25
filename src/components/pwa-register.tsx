"use client"

import { useEffect } from "react"

import { shouldRegisterServiceWorker } from "@/lib/pwa/config"

export function PwaRegister() {
  useEffect(() => {
    if (!shouldRegisterServiceWorker()) {
      return
    }

    void navigator.serviceWorker.register("/sw.js")
  }, [])

  return null
}
