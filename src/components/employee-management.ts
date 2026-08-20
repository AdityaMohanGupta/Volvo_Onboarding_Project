import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Employee, EmployeeDraft, EmployeeFormState } from '../models/employee'
import { EntityStore } from '../store/entity-store'
import { createId } from '../utils/id'

const FIELDS = [
  { key: 'name', label: 'Name', placeholder: 'Enter name' },
  { key: 'department', label: 'Department', placeholder: 'Enter department' },
  { key: 'designation', label: 'Designation', placeholder: 'Enter designation' },
  { key: 'email', label: 'Email', placeholder: 'Enter email' },
] as const satisfies ReadonlyArray<{
  key: keyof EmployeeFormState
  label: string
  placeholder: string
}>

//empty form state
const EMPTY_FORM: EmployeeFormState = {
  name: '',
  department: '',
  designation: '',
  email: '',
}

@customElement('employee-management')
export class EmployeeManagement extends LitElement {
  //the actual in-memory only - data is lost on page refresh
  private readonly store = new EntityStore<Employee>()

  // @state means Lit re-renders automatically whenever this field is reassigned
  // the full list
  @state()
  private employees: readonly Employee[] = []

  //whatever the user currently has typed into the form
  @state()
  private form: EmployeeFormState = { ...EMPTY_FORM }

  // id of the row being edited
  @state()
  private editingId: string | null = null

  //true only when all 4 fields are filled in
  private get isFormValid(): boolean {
    return FIELDS.every((field) => Boolean(this.form[field.key]?.trim()))
  }

  //describes what should be on screen, based on current state
  //Lit re-runs this whenever a @state field changes, and only patches what actually changed
  render() {
    return html`
      <div class="card">
        <h1>Employee Management</h1>

        <div class="fields">${FIELDS.map((field) => this.renderField(field))}</div>

        <div class="actions">
          <button
            class="btn btn-primary"
            type="button"
            ?disabled=${!this.isFormValid}
            @click=${this.handleSave}
          >
            ${this.editingId ? 'Update' : 'Save'}
          </button>
          <button class="btn btn-secondary" type="button" @click=${this.handleClear}>
            Clear
          </button>
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
            ${this.employees.length === 0
        ? html`<tr>
                  <td class="empty" colspan="5">No employees yet</td>
                </tr>`
        : this.employees.map((employee) => this.renderRow(employee))}
          </tbody>
        </table>
      </div>
    `
  }

  // renders a single form input, based on one entry from FIELDS
  private renderField(field: (typeof FIELDS)[number]) {
    const { key, label, placeholder } = field
    return html`
      <label class="field">
        <span>${label}</span>
        <input
          id=${key}
          type=${key === 'email' ? 'email' : 'text'}
          .value=${this.form[key] ?? ''}
          placeholder=${placeholder}
          @input=${(event: InputEvent) => this.handleInput(key, event)}
        />
      </label>
    `
  }

  // renders one table row, with its Edit/Delete buttons
  private renderRow(employee: Employee) {
    return html`
      <tr>
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td>${employee.designation}</td>
        <td>${employee.email}</td>
        <td class="actions-col">
          <button class="btn btn-edit" type="button" @click=${() => this.handleEdit(employee)}>
            Edit
          </button>
          <button
            class="btn btn-delete"
            type="button"
            @click=${() => this.handleDelete(employee.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    `
  }

  // updates form state whenever the user types into an input
  // spreads the old form and overwrites just the one key that changed
  private handleInput(key: keyof EmployeeFormState, event: InputEvent): void {
    const target = event.target as HTMLInputElement
    this.form = { ...this.form, [key]: target.value }
  }

  // runs on Save - the actual add/update logic
  private handleSave(): void {
    // bail out if any field is still empty
    if (!this.isFormValid) return

    // isFormValid already guarded this, so the form can safely be treated as a full EmployeeDraft
    const draft = this.form as EmployeeDraft

    // editingId set means we're updating an existing row, otherwise this is a brand new employee
    if (this.editingId) {
      this.store.update(this.editingId, draft)
    } else {
      this.store.add({ id: createId(), ...draft })
    }

    // re-read the store and reassign, this is what tells Lit to refresh the table
    this.employees = this.store.all
    this.resetForm()
  }

  // Clear button just resets the form
  private handleClear(): void {
    this.resetForm()
  }

  // Edit button fills the form with that row's data and remembers which row it is
  private handleEdit(employee: Employee): void {
    const { id, ...draft } = employee
    this.editingId = id
    this.form = { ...draft }
  }

  // Delete button removes the record, and resets the form if that row was being edited
  private handleDelete(id: string): void {
    this.store.remove(id)
    this.employees = this.store.all
    if (this.editingId === id) {
      this.resetForm()
    }
  }

  // resets the form back to empty and exits edit mode
  private resetForm(): void {
    this.form = { ...EMPTY_FORM }
    this.editingId = null
  }

  // scoped to this component's shadow DOM only - won't clash with or leak to the rest of the page
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
      color: #1c1c1e;
    }

    .card {
      max-width: 960px;
      margin: 0 auto;
      padding: 32px;
      border: 1px solid #dcdce1;
      border-radius: 12px;
      background: #fff;
      box-sizing: border-box;
    }

    h1 {
      margin: 0 0 28px;
      font-size: 28px;
      font-weight: 700;
    }

    h2 {
      margin: 0 0 20px;
      font-size: 20px;
      font-weight: 700;
    }

    .fields {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    input {
      font: inherit;
      font-weight: 400;
      padding: 10px 12px;
      border: 1px solid #d7d7dc;
      border-radius: 8px;
      background: #fafafb;
      box-sizing: border-box;
    }

    input:focus {
      outline: 2px solid #3a4cd0;
      outline-offset: 1px;
      background: #fff;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
    }

    .btn {
      font: inherit;
      font-weight: 600;
      font-size: 14px;
      padding: 10px 22px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }

    .btn:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .btn-primary {
      background: #3a4cd0;
      color: #fff;
    }

    .btn-secondary {
      background: #e9e9ee;
      color: #1c1c1e;
    }

    hr {
      border: none;
      border-top: 1px solid #e5e5ea;
      margin: 0 0 24px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      text-align: left;
      padding: 12px 8px;
      background: #f7f7f9;
      font-weight: 700;
      border-bottom: 1px solid #e5e5ea;
    }

    td {
      padding: 14px 8px;
      border-bottom: 1px solid #efeff2;
    }

    .empty {
      text-align: center;
      color: #8e8e93;
      padding: 24px 8px;
    }

    .actions-col {
      display: flex;
      gap: 8px;
    }

    .btn-edit {
      background: #3a4cd0;
      color: #fff;
      padding: 6px 14px;
    }

    .btn-delete {
      background: #fbe3e6;
      color: #d5303f;
      padding: 6px 14px;
    }

    @media (max-width: 720px) {
      .fields {
        grid-template-columns: 1fr;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  `
}

//'employee-management' be recognized as EmployeeManagement
declare global {
  interface HTMLElementTagNameMap {
    'employee-management': EmployeeManagement
  }
}
