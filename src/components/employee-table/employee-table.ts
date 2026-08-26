import { LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { Employee } from '../../models/employee'
import { employeeDeleteEvent, employeeEditEvent } from '../../events'
import { employeeTableStyles } from './employee-table.styles'
import { renderEmployeeTable } from './employee-table.template'

// <employee-table> - a dumb, reusable list. It doesn't own the data - main.ts
// hands it the current list through the `employees` property, and this
// component only ever announces user actions by dispatching "employee-edit" /
// "employee-delete". It never removes anything from the list itself.
@customElement('employee-table')
export class EmployeeTable extends LitElement {
  // set from outside (by main.ts) - the full list to display
  @property({ attribute: false })
  employees: readonly Employee[] = []

  // the "Employee deleted successfully!" style banner text, or null when hidden
  @state()
  private toast: string | null = null

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null

  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
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

  // tells whoever's listening (main.ts) to load this employee into the form
  private handleEdit(employee: Employee): void {
    this.dispatchEvent(
      new CustomEvent(employeeEditEvent, {
        detail: employee,
        bubbles: true,
        composed: true,
      }),
    )
  }

  // tells whoever's listening (main.ts) to remove this employee - this
  // component doesn't own the list, so it can't remove it itself
  private handleDelete(id: string): void {
    this.showToast('Employee deleted successfully!')
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
