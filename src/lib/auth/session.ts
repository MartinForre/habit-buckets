type MinimalSession = {
  access_token?: string | null
  expires_at?: number | null
}

export function isSessionActive(session: MinimalSession | null): boolean {
  if (!session?.access_token) {
    return false
  }

  if (!session.expires_at) {
    return true
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return session.expires_at > nowInSeconds
}
