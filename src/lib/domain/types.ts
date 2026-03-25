export type Bucket = {
  id: string
  name: string
  completed: boolean
}

export type Activity = {
  id: string
  name: string
  bucketIds: string[]
  completed: boolean
}

export type DailyState = {
  date: string
  buckets: Bucket[]
  activities: Activity[]
}

export type ActivityPayload = {
  name: string
  bucketIds: string[]
}
