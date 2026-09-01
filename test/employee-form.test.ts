import { fixture, html, expect, oneEvent } from '@open-wc/testing'
import '../src/components/employee-form/employee-form'
import type { EmployeeForm } from '../src/components/employee-form/employee-form'
import { employeeSaveEvent } from '../src/events'

function setInputValue(root: ShadowRoot, id: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(`#${id}`)!
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
}

describe('employee-form', () => {
  it('renders empty, showing "Save" and no errors before anything is submitted', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    const root = el.shadowRoot!

    expect(root.querySelector('.btn-primary')?.textContent?.trim()).to.equal('Save')
    expect(root.querySelectorAll('.field-error')).to.have.lengthOf(0)
  })

  it('shows a validation error per required field when Save is clicked on an empty form', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    const root = el.shadowRoot!

    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    await el.updateComplete

    const errors = [...root.querySelectorAll('.field-error')].map((error) => error.textContent?.trim())
    expect(errors).to.include('Name is required')
    expect(errors).to.include('Department is required')
    expect(errors).to.include('Enter a valid email')
    // Designation is the one optional field - it should never get an error
    expect(errors).to.have.lengthOf(3)
  })

  it('does not dispatch employee-save when the form is invalid', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    const root = el.shadowRoot!

    let saveFired = false
    el.addEventListener(employeeSaveEvent, () => {
      saveFired = true
    })

    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    await el.updateComplete

    expect(saveFired).to.be.false
  })

  it('dispatches employee-save with a complete record once every required field is valid', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    const root = el.shadowRoot!

    setInputValue(root, 'name', 'John Doe')
    setInputValue(root, 'department', 'Engineering')
    setInputValue(root, 'designation', 'Developer')
    setInputValue(root, 'email', 'john@example.com')
    await el.updateComplete

    const eventPromise = oneEvent(el, employeeSaveEvent)
    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    const { detail } = await eventPromise

    expect(detail.id).to.be.a('string').with.length.greaterThan(0)
    expect(detail.name).to.equal('John Doe')
    expect(detail.department).to.equal('Engineering')
    expect(detail.designation).to.equal('Developer')
    expect(detail.email).to.equal('john@example.com')
  })

  it('resets to a blank form after a successful save', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    const root = el.shadowRoot!

    setInputValue(root, 'name', 'John Doe')
    setInputValue(root, 'department', 'Engineering')
    setInputValue(root, 'email', 'john@example.com')
    await el.updateComplete
    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    await el.updateComplete

    expect(root.querySelector<HTMLInputElement>('#name')!.value).to.equal('')
  })

  it('populates its fields and switches to "Update" when the employee property is set', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    el.employee = {
      id: 'existing-id',
      name: 'Jane Smith',
      department: 'HR',
      designation: 'Manager',
      email: 'jane@example.com',
    }
    await el.updateComplete
    const root = el.shadowRoot!

    expect(root.querySelector<HTMLInputElement>('#name')!.value).to.equal('Jane Smith')
    expect(root.querySelector('.btn-primary')?.textContent?.trim()).to.equal('Update')
  })

  it('reuses the existing id (does not generate a new one) when saving an edit', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    el.employee = {
      id: 'existing-id',
      name: 'Jane Smith',
      department: 'HR',
      designation: 'Manager',
      email: 'jane@example.com',
    }
    await el.updateComplete
    const root = el.shadowRoot!
    setInputValue(root, 'department', 'Finance')
    await el.updateComplete

    const eventPromise = oneEvent(el, employeeSaveEvent)
    root.querySelector<HTMLButtonElement>('.btn-primary')!.click()
    const { detail } = await eventPromise

    expect(detail.id).to.equal('existing-id')
    expect(detail.department).to.equal('Finance')
  })

  it('clears back to a blank, non-editing form when Clear is clicked', async () => {
    const el = await fixture<EmployeeForm>(html`<employee-form></employee-form>`)
    el.employee = {
      id: 'existing-id',
      name: 'Jane Smith',
      department: 'HR',
      designation: 'Manager',
      email: 'jane@example.com',
    }
    await el.updateComplete
    const root = el.shadowRoot!

    root.querySelector<HTMLButtonElement>('.btn-secondary')!.click()
    await el.updateComplete

    expect(root.querySelector<HTMLInputElement>('#name')!.value).to.equal('')
    expect(root.querySelector('.btn-primary')?.textContent?.trim()).to.equal('Save')
  })
})
