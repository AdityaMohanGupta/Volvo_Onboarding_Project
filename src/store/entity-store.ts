/**
 * Anything that can live in an EntityStore must be identifiable by a
 * string id — this is the only constraint the generic places on T.
 */
export interface Identifiable {
  id: string
}

/**
 * A minimal, framework-agnostic in-memory CRUD store.
 *
 * Generic over T so it can back any identifiable record (employees today,
 * something else tomorrow) while staying fully typed end to end — no casts
 * needed at the call site.
 */
export class EntityStore<T extends Identifiable> {
  #items: T[] = []

  /** Read-only snapshot of everything currently in the store. */
  get all(): readonly T[] {
    return this.#items
  }

  add(item: T): void {
    this.#items = [...this.#items, item]
  }

  update(id: T['id'], patch: Partial<Omit<T, 'id'>>): void {
    this.#items = this.#items.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    )
  }

  remove(id: T['id']): void {
    this.#items = this.#items.filter((item) => item.id !== id)
  }

  find(id: T['id']): T | undefined {
    return this.#items.find((item) => item.id === id)
  }
}
