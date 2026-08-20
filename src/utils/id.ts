/** Generates a unique id for new records. */
export function createId(): string {
  return crypto.randomUUID()
}
