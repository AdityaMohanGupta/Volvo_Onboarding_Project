import { html } from 'lit'
import type { Employee, EmployeeFormState } from '../models/employee'
import { isValidEmail } from '../utils/validation'
import { checkCircleIcon, closeIcon, pencilIcon, trashIcon } from './icons'

// shape of one form field's config
interface Field {
  readonly key: keyof EmployeeFormState
  readonly label: string
  readonly placeholder: string
  readonly required: boolean
}

// everything the template needs - passed in as plain data + callbacks, no access to component internals
export interface EmployeeManagementViewProps {
  fields: readonly Field[]
  form: EmployeeFormState
  isEditing: boolean
  employees: readonly Employee[]
  toast: string | null
  submitted: boolean
  onFieldInput: (key: keyof EmployeeFormState, event: InputEvent) => void
  onSave: () => void
  onClear: () => void
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  onDismissToast: () => void
}

// error message for one field, or null if it's fine - only ever shown once submitted is true
function getFieldError(field: Field, value: string, submitted: boolean): string | null {
  if (!submitted) return null

  if (field.key === 'email') {
    return isValidEmail(value) ? null : 'Enter a valid email'
  }

  if (field.required && !value.trim()) {
    return `${field.label} is required`
  }

  return null
}

// renders a single form input, based on one field's config
function renderField(
  field: Field,
  form: EmployeeFormState,
  submitted: boolean,
  onFieldInput: EmployeeManagementViewProps['onFieldInput'],
) {
  const { key, label, placeholder, required } = field
  const value = form[key] ?? ''
  const error = getFieldError(field, value, submitted)

  return html`
    <label class="field">
      <span>${label}${required ? html`<span class="required-mark">*</span>` : null}</span>
      <input
        id=${key}
        type=${key === 'email' ? 'email' : 'text'}
        .value=${value}
        placeholder=${placeholder}
        aria-invalid=${error ? 'true' : 'false'}
        @input=${(event: InputEvent) => onFieldInput(key, event)}
      />
      ${error ? html`<span class="field-error" role="alert">${error}</span>` : null}
    </label>
  `
}

// renders one grid row, with its Edit/Delete buttons
// role="row" + role="cell" keep it announced as a table to screen readers, even though it's <div>s now
function renderRow(
  employee: Employee,
  onEdit: EmployeeManagementViewProps['onEdit'],
  onDelete: EmployeeManagementViewProps['onDelete'],
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
export function renderEmployeeManagement(props: EmployeeManagementViewProps) {
  const {
    fields,
    form,
    isEditing,
    employees,
    toast,
    submitted,
    onFieldInput,
    onSave,
    onClear,
    onEdit,
    onDelete,
    onDismissToast,
  } = props

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

      <h1>Employee Management</h1>

      <div class="fields">
        ${fields.map((field) => renderField(field, form, submitted, onFieldInput))}
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="button" @click=${onSave}>
          ${isEditing ? 'Update' : 'Save'}
        </button>
        <button class="btn btn-secondary" type="button" @click=${onClear}>Clear</button>
      </div>

      <hr />

      <h2>Employee List</h2>

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
