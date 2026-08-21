// simple email shape check - good enough to catch typos, not a full RFC validator
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// true if the given string looks like a real email address
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}
