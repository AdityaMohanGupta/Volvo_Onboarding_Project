import { html } from 'lit'
import type { Employee, EmployeeFormState } from '../models/employee'

// shape of one form field's config
interface Field {
  readonly key: keyof EmployeeFormState
  readonly label: string
  readonly placeholder: string
}

// everything the template needs - passed in as plain data + callbacks, no access to component internals
export interface EmployeeManagementViewProps {
  fields: readonly Field[]
  form: EmployeeFormState
  isFormValid: boolean
  isEditing: boolean
  employees: readonly Employee[]
  onFieldInput: (key: keyof EmployeeFormState, event: InputEvent) => void
  onSave: () => void
  onClear: () => void
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
}

// renders a single form input, based on one field's config
function renderField(
  field: Field,
  form: EmployeeFormState,
  onFieldInput: EmployeeManagementViewProps['onFieldInput'],
) {
  const { key, label, placeholder } = field
  return html`
    <label class="field">
      <span>${label}</span>
      <input
        id=${key}
        type=${key === 'email' ? 'email' : 'text'}
        .value=${form[key] ?? ''}
        placeholder=${placeholder}
        @input=${(event: InputEvent) => onFieldInput(key, event)}
      />
    </label>
  `
}

// renders one table row, with its Edit/Delete buttons
function renderRow(
  employee: Employee,
  onEdit: EmployeeManagementViewProps['onEdit'],
  onDelete: EmployeeManagementViewProps['onDelete'],
) {
  return html`
    <tr>
      <td>${employee.name}</td>
      <td>${employee.department}</td>
      <td>${employee.designation}</td>
      <td>${employee.email}</td>
      <td class="actions-col">
        <button class="btn btn-edit" type="button" @click=${() => onEdit(employee)}>
          Edit
        </button>
        <button class="btn btn-delete" type="button" @click=${() => onDelete(employee.id)}>
          Delete
        </button>
      </td>
    </tr>
  `
}

// describes what should be on screen, based on current state
export function renderEmployeeManagement(props: EmployeeManagementViewProps) {
  const { fields, form, isFormValid, isEditing, employees, onFieldInput, onSave, onClear, onEdit, onDelete } =
    props

  return html`
    <div class="card">
      <h1>Employee Management</h1>

      <div class="fields">${fields.map((field) => renderField(field, form, onFieldInput))}</div>

      <div class="actions">
        <button class="btn btn-primary" type="button" ?disabled=${!isFormValid} @click=${onSave}>
          ${isEditing ? 'Update' : 'Save'}
        </button>
        <button class="btn btn-secondary" type="button" @click=${onClear}>Clear</button>
      </div>

      <hr />

      <h2>Employee List</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Email</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${employees.length === 0
            ? html`<tr>
                <td class="empty" colspan="5">No employees yet</td>
              </tr>`
            : employees.map((employee) => renderRow(employee, onEdit, onDelete))}
        </tbody>
      </table>
    </div>
  `
}
