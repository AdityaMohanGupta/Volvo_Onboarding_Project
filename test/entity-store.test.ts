import { expect } from '@open-wc/testing'
import { EntityStore } from '../src/store/entity-store'

interface TestItem {
  id: string
  label: string
}

describe('EntityStore', () => {
  it('starts empty', () => {
    const store = new EntityStore<TestItem>()
    expect(store.all).to.have.lengthOf(0)
  })

  it('adds an item', () => {
    const store = new EntityStore<TestItem>()
    store.add({ id: '1', label: 'a' })
    expect(store.all).to.deep.equal([{ id: '1', label: 'a' }])
  })

  it('finds an item by id, and returns undefined when it does not exist', () => {
    const store = new EntityStore<TestItem>()
    store.add({ id: '1', label: 'a' })
    expect(store.find('1')).to.deep.equal({ id: '1', label: 'a' })
    expect(store.find('missing')).to.be.undefined
  })

  it('updates one item without touching the others', () => {
    const store = new EntityStore<TestItem>()
    store.add({ id: '1', label: 'a' })
    store.add({ id: '2', label: 'b' })

    store.update('1', { label: 'updated' })

    expect(store.find('1')?.label).to.equal('updated')
    expect(store.find('2')?.label).to.equal('b')
  })

  it('removes an item', () => {
    const store = new EntityStore<TestItem>()
    store.add({ id: '1', label: 'a' })
    store.add({ id: '2', label: 'b' })

    store.remove('1')

    expect(store.all).to.deep.equal([{ id: '2', label: 'b' }])
  })

  it('does not mutate a previously read snapshot of .all', () => {
    const store = new EntityStore<TestItem>()
    store.add({ id: '1', label: 'a' })
    const snapshot = store.all

    store.add({ id: '2', label: 'b' })

    expect(snapshot).to.have.lengthOf(1)
    expect(store.all).to.have.lengthOf(2)
  })
})
