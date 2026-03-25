export type BucketTone = {
  containerClass: string
  badgeClass: string
  label: "Complete" | "Incomplete"
}

export type ActivityToggleTone = {
  label: string
  badgeClass: string
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
      label: "Checked",
      badgeClass: "bg-emerald-100 text-emerald-800",
    }
  }

  return {
    label: "Tap to check",
    badgeClass: "bg-zinc-200 text-zinc-700",
  }
}
