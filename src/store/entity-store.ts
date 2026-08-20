
export interface Identifiable {
  id: string
}

//CRUD store
export class EntityStore<T extends Identifiable> {
  #items: T[] = []

  //read-only values
  get all(): readonly T[] {
    return this.#items
  }

  //adds a new record
  add(item: T): void {
    this.#items = [...this.#items, item]
  }

  //patches the item
  update(id: T['id'], patch: Partial<Omit<T, 'id'>>): void {
    this.#items = this.#items.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    )
  }

  //removes the item
  remove(id: T['id']): void {
    this.#items = this.#items.filter((item) => item.id !== id)
  }

  //finds a single item
  find(id: T['id']): T | undefined {
    return this.#items.find((item) => item.id === id)
  }
}
