import type { Metadata, Viewport } from "next"

import { PwaRegister } from "@/components/pwa-register"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { assertRequiredEnv } from "@/lib/env"
import { PWA_APP_NAME, PWA_THEME_COLOR } from "@/lib/pwa/config"

import "./globals.css"

assertRequiredEnv()

export const metadata: Metadata = {
  title: PWA_APP_NAME,
  description: "A minimal daily habit tracker with bucket-based progress",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: PWA_APP_NAME,
  },
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  themeColor: PWA_THEME_COLOR,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <PullToRefresh />
        {children}
      </body>
    </html>
  )
}
