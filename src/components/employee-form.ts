import { LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Employee, EmployeeDraft, EmployeeFormState } from '../models/employee'
import { isValidEmail } from '../utils/validation'
import { employeeDeleteEvent, employeeEditEvent, employeeSaveEvent } from '../events'
import { employeeFormStyles } from './employee-form.styles'
import { renderEmployeeForm } from './employee-form.template'

// Designation is the only optional field
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

// <employee-form> - fully standalone, knows nothing about any table or store.
// it only ever talks to the rest of the page through two events:
//   - dispatches "employee-save" when Save/Update is clicked on a valid form
//   - listens for "employee-edit" (from anywhere) to pre-fill itself for editing
@customElement('employee-form')
export class EmployeeForm extends LitElement {
  //whatever the user currently has typed into the form
  @state()
  private form: EmployeeFormState = { ...emptyForm }

  // id of the employee being edited, or null when adding a new one
  @state()
  private editingId: string | null = null

  // becomes true the first time Save is clicked - error messages only show after that
  @state()
  private submitted = false

  // the "Employee added successfully!" style banner text, or null when hidden
  @state()
  private toast: string | null = null

  // handle for the auto-dismiss timer, so a new toast can cancel a still-pending one
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null

  // true when every required field is filled in and the email looks like a real email
  private get isFormValid(): boolean {
    return fields.every((field) => {
      const value = this.form[field.key]?.trim() ?? ''
      if (field.key === 'email') return isValidEmail(value)
      return !field.required || value.length > 0
    })
  }

  connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener(employeeEditEvent, this.handleExternalEdit)
    document.addEventListener(employeeDeleteEvent, this.handleExternalDelete)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener(employeeEditEvent, this.handleExternalEdit)
    document.removeEventListener(employeeDeleteEvent, this.handleExternalDelete)
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
  }

  // an arrow function field keeps `this` bound correctly when used as an event listener
  private handleExternalEdit = (event: Event): void => {
    const employee = (event as CustomEvent<Employee>).detail
    const { id, ...draft } = employee
    this.editingId = id
    this.form = { ...draft }
    this.submitted = false
  }

  // if the record we're currently editing just got deleted elsewhere, don't stay
  // open editing something that no longer exists
  private handleExternalDelete = (event: Event): void => {
    const deletedId = (event as CustomEvent<string>).detail
    if (this.editingId === deletedId) {
      this.resetForm()
    }
  }

  render() {
    return renderEmployeeForm({
      fields,
      form: this.form,
      isEditing: this.editingId !== null,
      submitted: this.submitted,
      toast: this.toast,
      onFieldInput: (key, event) => this.handleInput(key, event),
      onSave: () => this.handleSave(),
      onClear: () => this.handleClear(),
      onDismissToast: () => this.dismissToast(),
    })
  }

  private handleInput(key: keyof EmployeeFormState, event: InputEvent): void {
    const target = event.target as HTMLInputElement
    this.form = { ...this.form, [key]: target.value }
  }

  // runs on Save - validates, then just announces the result and resets
  private handleSave(): void {
    this.submitted = true
    if (!this.isFormValid) return

    const draft = this.form as EmployeeDraft

    this.dispatchEvent(
      new CustomEvent(employeeSaveEvent, {
        detail: { id: this.editingId, draft },
        bubbles: true,
        composed: true,
      }),
    )

    this.showToast(this.editingId ? 'Employee updated successfully!' : 'Employee added successfully!')
    this.resetForm()
  }

  private handleClear(): void {
    this.resetForm()
  }

  private resetForm(): void {
    this.form = { ...emptyForm }
    this.editingId = null
    this.submitted = false
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

  static styles = employeeFormStyles
}

declare global {
  interface HTMLElementTagNameMap {
    'employee-form': EmployeeForm
  }
}
