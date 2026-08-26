import { html } from 'lit'
import type { Employee } from '../../models/employee'
import { checkCircleIcon, closeIcon, pencilIcon, trashIcon } from '../../assets/icons'

// everything the template needs - passed in as plain data + callbacks, no access to component internals
export interface EmployeeTableViewProps {
  employees: readonly Employee[]
  toast: string | null
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  onDismissToast: () => void
}

// renders one grid row, with its Edit/Delete buttons
// role="row" + role="cell" keep it announced as a table to screen readers, even though it's <div>s
function renderRow(
  employee: Employee,
  onEdit: EmployeeTableViewProps['onEdit'],
  onDelete: EmployeeTableViewProps['onDelete'],
) {
  return html`
    <div class="row" role="row">
      <div class="cell" role="cell">${employee.name}</div>
      <div class="cell" role="cell">${employee.department}</div>
      <div class="cell" role="cell">${employee.designation}</div>
      <div class="cell" role="cell">${employee.email}</div>
      <div class="cell actions-col" role="cell">
        <button
          class="icon-btn edit"
          type="button"
          aria-label="Edit ${employee.name}"
          @click=${() => onEdit(employee)}
        >
          ${pencilIcon}
        </button>
        <button
          class="icon-btn delete"
          type="button"
          aria-label="Delete ${employee.name}"
          @click=${() => onDelete(employee.id)}
        >
          ${trashIcon}
        </button>
      </div>
    </div>
  `
}

// describes what should be on screen, based on current state
export function renderEmployeeTable(props: EmployeeTableViewProps) {
  const { employees, toast, onEdit, onDelete, onDismissToast } = props

  return html`
    <div class="card">
      ${toast
        ? html`
            <div class="toast" role="status">
              <span class="toast-icon">${checkCircleIcon}</span>
              <span class="toast-message">${toast}</span>
              <button class="toast-close" type="button" aria-label="Dismiss" @click=${onDismissToast}>
                ${closeIcon}
              </button>
            </div>
          `
        : null}

      <h1>Employee Table</h1>

      <div class="table-scroll">
        <div class="table" role="table" aria-label="Employee List">
          <div class="row head" role="row">
            <div class="cell" role="columnheader">Name</div>
            <div class="cell" role="columnheader">Department</div>
            <div class="cell" role="columnheader">Designation</div>
            <div class="cell" role="columnheader">Email</div>
            <div class="cell actions-col" role="columnheader">Actions</div>
          </div>
          ${employees.length === 0
            ? html`<div class="row" role="row">
                <div class="cell empty" role="cell">No employees yet</div>
              </div>`
            : employees.map((employee) => renderRow(employee, onEdit, onDelete))}
        </div>
      </div>
    </div>
  `
}
