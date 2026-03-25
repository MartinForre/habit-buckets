export type BucketTone = {
  containerClass: string
  badgeClass: string
  label: "Complete" | "Incomplete"
}

export type ActivityToggleTone = {
  checked: boolean
  circleClass: string
  checkClass: string
}

export function getBucketTone(completed: boolean): BucketTone {
  if (completed) {
    return {
      containerClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
      badgeClass: "bg-emerald-100 text-emerald-800",
      label: "Complete",
    }
  }

  return {
    containerClass: "border-border bg-muted/40",
    badgeClass: "bg-zinc-200 text-zinc-700",
    label: "Incomplete",
  }
}

export function getActivityToggleTone(completed: boolean): ActivityToggleTone {
  if (completed) {
    return {
      checked: true,
      circleClass: "border-emerald-300 bg-emerald-100",
      checkClass: "text-emerald-700",
    }
  }

  return {
    checked: false,
    circleClass: "border-zinc-300 bg-zinc-100",
    checkClass: "text-zinc-500",
  }
}
