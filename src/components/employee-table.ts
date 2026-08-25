import { LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Employee, EmployeeSaveDetail } from '../models/employee'
import { EntityStore } from '../store/entity-store'
import { createId } from '../utils/id'
import { employeeDeleteEvent, employeeEditEvent, employeeSaveEvent } from '../events'
import { employeeTableStyles } from './employee-table.styles'
import { renderEmployeeTable } from './employee-table.template'

// <employee-table> - fully standalone, owns the actual employee list.
// it only ever talks to the rest of the page through two events:
//   - listens for "employee-save" (from anywhere) to add/update its list
//   - dispatches "employee-edit" when its Edit button is clicked
@customElement('employee-table')
export class EmployeeTable extends LitElement {
  //the actual in-memory "database" - data is lost on page refresh
  private readonly store = new EntityStore<Employee>()

  //the full list currently shown
  @state()
  private employees: readonly Employee[] = []

  // the "Employee deleted successfully!" style banner text, or null when hidden
  @state()
  private toast: string | null = null

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener(employeeSaveEvent, this.handleExternalSave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(employeeSaveEvent, this.handleExternalSave)
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
  }

  // an arrow function field keeps `this` bound correctly when used as an event listener
  private handleExternalSave = (event: Event): void => {
    const { id, draft } = (event as CustomEvent<EmployeeSaveDetail>).detail

    if (id) {
      this.store.update(id, draft)
    } else {
      this.store.add({ id: createId(), ...draft })
    }

    this.employees = this.store.all
  }

  render() {
    return renderEmployeeTable({
      employees: this.employees,
      toast: this.toast,
      onEdit: (employee) => this.handleEdit(employee),
      onDelete: (id) => this.handleDelete(id),
      onDismissToast: () => this.dismissToast(),
    })
  }

  // tells whoever's listening (an <employee-form> on the page) to load this employee
  private handleEdit(employee: Employee): void {
    this.dispatchEvent(
      new CustomEvent(employeeEditEvent, {
        detail: employee,
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleDelete(id: string): void {
    this.store.remove(id)
    this.employees = this.store.all
    this.showToast('Employee deleted successfully!')

    // tells whoever's listening (an <employee-form> that might be mid-edit on this
    // very id) that it's gone, so it doesn't stay open editing a deleted record
    this.dispatchEvent(
      new CustomEvent(employeeDeleteEvent, {
        detail: id,
        bubbles: true,
        composed: true,
      }),
    )
  }

  private showToast(message: string): void {
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
    this.toast = message
    this.toastTimeoutId = setTimeout(() => {
      this.toast = null
      this.toastTimeoutId = null
    }, 3000)
  }

  private dismissToast(): void {
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
      this.toastTimeoutId = null
    }
    this.toast = null
  }

  static styles = employeeTableStyles
}

declare global {
  interface HTMLElementTagNameMap {
    'employee-table': EmployeeTable
  }
}
