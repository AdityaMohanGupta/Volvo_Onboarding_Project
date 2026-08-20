//generates a unique id
export function createId(): string {
  return crypto.randomUUID()
}
