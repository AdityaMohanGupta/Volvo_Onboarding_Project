import { LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Employee, EmployeeDraft, EmployeeFormState } from '../models/employee'
import { EntityStore } from '../store/entity-store'
import { createId } from '../utils/id'
import { employeeManagementStyles } from './employee-management.styles'
import { renderEmployeeManagement } from './employee-management.template'

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

  // hands the current state + callbacks off to the template file, gets a TemplateResult back
  render() {
    return renderEmployeeManagement({
      fields: FIELDS,
      form: this.form,
      isFormValid: this.isFormValid,
      isEditing: this.editingId !== null,
      employees: this.employees,
      onFieldInput: (key, event) => this.handleInput(key, event),
      onSave: () => this.handleSave(),
      onClear: () => this.handleClear(),
      onEdit: (employee) => this.handleEdit(employee),
      onDelete: (id) => this.handleDelete(id),
    })
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

  static styles = employeeManagementStyles
}

//'employee-management' be recognized as EmployeeManagement
declare global {
  interface HTMLElementTagNameMap {
    'employee-management': EmployeeManagement
  }
}
