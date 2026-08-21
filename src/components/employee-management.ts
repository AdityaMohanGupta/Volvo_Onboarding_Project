import { LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Employee, EmployeeDraft, EmployeeFormState } from '../models/employee'
import { EntityStore } from '../store/entity-store'
import { createId } from '../utils/id'
import { isValidEmail } from '../utils/validation'
import { employeeManagementStyles } from './employee-management.styles'
import { renderEmployeeManagement } from './employee-management.template'

// Designation is the only optional field - matches the reference design's asterisks
const fields = [
  { key: 'name', label: 'Name', placeholder: 'Enter name', required: true },
  { key: 'department', label: 'Department', placeholder: 'Enter department', required: true },
  { key: 'designation', label: 'Designation', placeholder: 'Enter designation', required: false },
  { key: 'email', label: 'Email', placeholder: 'Enter email', required: true },
] as const satisfies ReadonlyArray<{
  key: keyof EmployeeFormState
  label: string
  placeholder: string
  required: boolean
}>

//empty form state
const emptyForm: EmployeeFormState = {
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
  private form: EmployeeFormState = { ...emptyForm }

  // id of the row being edited
  @state()
  private editingId: string | null = null

  // the "Employee added successfully!" style banner text, or null when hidden
  @state()
  private toast: string | null = null

  // handle for the auto-dismiss timer, so a new toast can cancel a still-pending one
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null

  // becomes true the first time Save is clicked - error messages only show after that,
  // never on a form the user hasn't tried to submit yet
  @state()
  private submitted = false

  // true when every required field is filled in and the email looks like a real email
  private get isFormValid(): boolean {
    return fields.every((field) => {
      const value = this.form[field.key]?.trim() ?? ''
      if (field.key === 'email') return isValidEmail(value)
      return !field.required || value.length > 0
    })
  }

  // hands the current state + callbacks off to the template file, gets a TemplateResult back
  render() {
    return renderEmployeeManagement({
      fields,
      form: this.form,
      isEditing: this.editingId !== null,
      employees: this.employees,
      toast: this.toast,
      submitted: this.submitted,
      onFieldInput: (key, event) => this.handleInput(key, event),
      onSave: () => this.handleSave(),
      onClear: () => this.handleClear(),
      onEdit: (employee) => this.handleEdit(employee),
      onDelete: (id) => this.handleDelete(id),
      onDismissToast: () => this.dismissToast(),
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
    // marks the form as "attempted" so validation errors start showing
    this.submitted = true

    // bail out if any required field is still empty or the email is malformed
    if (!this.isFormValid) return

    // isFormValid already guarded this, so the form can safely be treated as a full EmployeeDraft
    const draft = this.form as EmployeeDraft

    // editingId set means we're updating an existing row, otherwise this is a brand new employee
    if (this.editingId) {
      this.store.update(this.editingId, draft)
      this.showToast('Employee updated successfully!')
    } else {
      this.store.add({ id: createId(), ...draft })
      this.showToast('Employee added successfully!')
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
    this.showToast('Employee deleted successfully!')
    if (this.editingId === id) {
      this.resetForm()
    }
  }

  // resets the form back to empty and exits edit mode
  private resetForm(): void {
    this.form = { ...emptyForm }
    this.editingId = null
    this.submitted = false
  }

  // shows the banner and (re)starts its auto-dismiss timer
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

  // dismisses the banner immediately, e.g. via its close button
  private dismissToast(): void {
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
      this.toastTimeoutId = null
    }
    this.toast = null
  }

  // stop a pending timer from firing after the component is gone
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
  }

  static styles = employeeManagementStyles
}

//'employee-management' be recognized as EmployeeManagement
declare global {
  interface HTMLElementTagNameMap {
    'employee-management': EmployeeManagement
  }
}
