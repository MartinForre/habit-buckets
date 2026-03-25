export class UserSafeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserSafeError"
  }
}
