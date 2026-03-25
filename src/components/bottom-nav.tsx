import Link from "next/link"

type BottomNavProps = {
  current: "today" | "manage" | "history"
}

const items: Array<{ key: BottomNavProps["current"]; label: string; href: string }> = [
  { key: "today", label: "Today", href: "/dashboard" },
  { key: "manage", label: "Manage", href: "/dashboard/manage" },
  { key: "history", label: "History", href: "/history" },
]

export function BottomNav({ current }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 z-50 mx-auto w-[min(56rem,calc(100%-1rem))]"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="surface-card grid grid-cols-3 gap-1 p-1 backdrop-blur">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className={`touch-target flex items-center justify-center rounded-xl text-sm font-semibold transition ${
                current === item.key
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
