"use client"

import { useEffect, useMemo, useState } from "react"

const TRIGGER_DISTANCE = 86

function getReloadUrl(): string {
  const url = new URL(window.location.href)
  url.searchParams.set("refresh", String(Date.now()))
  return url.toString()
}

export function PullToRefresh() {
  const [distance, setDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const progress = useMemo(() => Math.min(distance / TRIGGER_DISTANCE, 1), [distance])

  useEffect(() => {
    let startY = 0
    let pulling = false

    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) {
        pulling = false
        return
      }

      startY = event.touches[0]?.clientY ?? 0
      pulling = true
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!pulling || refreshing) {
        return
      }

      const currentY = event.touches[0]?.clientY ?? 0
      const delta = currentY - startY

      if (delta <= 0) {
        setDistance(0)
        return
      }

      if (window.scrollY > 0) {
        pulling = false
        setDistance(0)
        return
      }

      event.preventDefault()
      setDistance(Math.min(delta * 0.7, 120))
    }

    const onTouchEnd = () => {
      if (!pulling || refreshing) {
        setDistance(0)
        pulling = false
        return
      }

      const shouldRefresh = distance >= TRIGGER_DISTANCE

      pulling = false
      setDistance(0)

      if (!shouldRefresh) {
        return
      }

      setRefreshing(true)
      window.location.replace(getReloadUrl())
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [distance, refreshing])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-2 z-[70] flex justify-center"
      style={{
        transform: `translateY(${Math.max(distance - 42, 0)}px)`,
        opacity: distance > 0 || refreshing ? 1 : 0,
        transition: refreshing ? "none" : "opacity 120ms ease",
      }}
    >
      <div className="surface-card flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground">
        <span
          className="size-2 rounded-full bg-primary"
          style={{
            transform: `scale(${0.6 + progress * 0.8})`,
            opacity: 0.45 + progress * 0.55,
          }}
        />
        {refreshing ? "Refreshing..." : progress >= 1 ? "Release to refresh" : "Pull to refresh"}
      </div>
    </div>
  )
}
