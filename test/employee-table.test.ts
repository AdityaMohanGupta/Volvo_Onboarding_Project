import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import '../src/components/employee-table/employee-table'
import type { EmployeeTable } from '../src/components/employee-table/employee-table'
import { employeeDeleteEvent, employeeEditEvent } from '../src/events'
import type { Employee } from '../src/models/employee'

const sampleEmployee: Employee = {
  id: 'abc-123',
  name: 'John Doe',
  department: 'Engineering',
  designation: 'Developer',
  email: 'john@example.com',
}

describe('employee-table', () => {
  it('shows "No employees yet" when given an empty list', async () => {
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    const root = el.shadowRoot!

    expect(root.querySelector('.empty')?.textContent?.trim()).to.equal('No employees yet')
  })

  it('renders one row per employee when given a list', async () => {
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    el.employees = [sampleEmployee]
    await el.updateComplete
    const root = el.shadowRoot!

    const rows = root.querySelectorAll('.row:not(.head)')
    expect(rows).to.have.lengthOf(1)
    expect(rows[0].textContent).to.contain('John Doe')
    expect(rows[0].textContent).to.contain('john@example.com')
  })

  it('dispatches employee-edit with the full employee record when Edit is clicked', async () => {
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    el.employees = [sampleEmployee]
    await el.updateComplete
    const root = el.shadowRoot!

    const eventPromise = oneEvent(el, employeeEditEvent)
    root.querySelector<HTMLButtonElement>('.icon-btn.edit')!.click()
    const { detail } = await eventPromise

    expect(detail).to.deep.equal(sampleEmployee)
  })

  it('dispatches employee-delete with just the id when Delete is clicked', async () => {
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    el.employees = [sampleEmployee]
    await el.updateComplete
    const root = el.shadowRoot!

    const eventPromise = oneEvent(el, employeeDeleteEvent)
    root.querySelector<HTMLButtonElement>('.icon-btn.delete')!.click()
    const { detail } = await eventPromise

    expect(detail).to.equal('abc-123')
  })

  it('shows a success toast after Delete is clicked', async () => {
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    el.employees = [sampleEmployee]
    await el.updateComplete
    const root = el.shadowRoot!

    root.querySelector<HTMLButtonElement>('.icon-btn.delete')!.click()
    await el.updateComplete

    expect(root.querySelector('.toast-message')?.textContent?.trim()).to.equal('Employee deleted successfully!')
  })

  it('does not remove anything from its own list on delete - it only announces the id', async () => {
    // this component doesn't own the data (main.ts does), so clicking delete
    // must NOT change what's in `employees` on its own
    const el = await fixture<EmployeeTable>(html`<employee-table></employee-table>`)
    el.employees = [sampleEmployee]
    await el.updateComplete
    const root = el.shadowRoot!

    root.querySelector<HTMLButtonElement>('.icon-btn.delete')!.click()
    await el.updateComplete

    expect(el.employees).to.deep.equal([sampleEmployee])
  })
})
