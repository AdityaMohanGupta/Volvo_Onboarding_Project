import { LitElement, css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import type { Employee } from '../models/employee'
import { EntityStore } from '../store/entity-store'
import { employeeDeleteEvent, employeeEditEvent, employeeSaveEvent } from '../events'
import type { EmployeeForm } from '../components/employee-form/employee-form'
import '../components/employee-form/employee-form'
import '../components/employee-table/employee-table'

// <employee-widget> - the one tag that makes the whole feature work. It
// composes <employee-form> and <employee-table> in its own shadow DOM and
// owns the actual data - this is the same coordinating job main.ts used to
// do, just packaged as a real parent component instead of a plain script.
// Because the two children now live inside this component's shadow root,
// their bubbling events reach `this` directly - no document-level listening
// needed, unlike the old main.ts approach.
@customElement('employee-widget')
export class EmployeeWidget extends LitElement {
  private readonly store = new EntityStore<Employee>()

  // typed references to the two children, found automatically after render
  @query('employee-form')
  private formElement?: EmployeeForm

  @state()
  private employees: readonly Employee[] = []

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener(employeeSaveEvent, this.handleSave)
    this.addEventListener(employeeEditEvent, this.handleEdit)
    this.addEventListener(employeeDeleteEvent, this.handleDelete)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener(employeeSaveEvent, this.handleSave)
    this.removeEventListener(employeeEditEvent, this.handleEdit)
    this.removeEventListener(employeeDeleteEvent, this.handleDelete)
  }

  // arrow function fields keep `this` bound correctly when used as listeners.
  // parameters are typed via the HTMLElementEventMap augmentation in events.ts
  // (the same one that let main.ts drop its casts) - no `as CustomEvent<...>`
  // needed here either
  private handleSave = (event: HTMLElementEventMap[typeof employeeSaveEvent]): void => {
    const employeeToSave = event.detail

    if (this.store.find(employeeToSave.id)) {
      const { id, ...draft } = employeeToSave
      this.store.update(id, draft)
    } else {
      this.store.add(employeeToSave)
    }

    this.employees = this.store.all
  }

  private handleEdit = (event: HTMLElementEventMap[typeof employeeEditEvent]): void => {
    const employeeToEdit = event.detail
    if (this.formElement) {
      this.formElement.employee = employeeToEdit
    }
  }

  private handleDelete = (event: HTMLElementEventMap[typeof employeeDeleteEvent]): void => {
    const employeeIdToDelete = event.detail
    this.store.remove(employeeIdToDelete)
    this.employees = this.store.all

    // if the row being deleted is the one currently loaded into the form, the
    // form would otherwise keep showing data for an employee that no longer
    // exists - clearing it avoids saving a "resurrected" record
    if (this.formElement && this.formElement.employee?.id === employeeIdToDelete) {
      this.formElement.employee = null
    }
  }

  render() {
    return html`
      <employee-form></employee-form>
      <employee-table .employees=${this.employees}></employee-table>
    `
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      width: 100%;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'employee-widget': EmployeeWidget
  }
}
