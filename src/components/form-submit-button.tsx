"use client"

import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"

type FormSubmitButtonProps = {
  idleLabel: string
  pendingLabel?: string
  className?: string
}

export function FormSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition disabled:opacity-60",
        "border-border bg-background text-foreground",
        className
      )}
    >
      {pending ? pendingLabel ?? `${idleLabel}...` : idleLabel}
    </button>
  )
}
