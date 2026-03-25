const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/

export function getTodayDateKey(timeZone = "UTC", now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  return formatter.format(now)
}

export function isDateKey(value: string): boolean {
  return DATE_KEY_REGEX.test(value)
}

export function assertDateKey(value: string): string {
  if (!isDateKey(value)) {
    throw new Error("Please provide a valid date in YYYY-MM-DD format")
  }

  return value
}
