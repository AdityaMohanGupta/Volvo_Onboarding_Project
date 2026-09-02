import { LitElement, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { Employee, EmployeeDraft, EmployeeFormState } from '../../models/employee'
import { isValidEmail } from '../../utils/validation'
import { createId } from '../../utils/id'
import { employeeSaveEvent } from '../../events'
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

// true when every required field is filled in and the email looks like a real
// email. This is a type guard (the `form is EmployeeDraft` return type) - so
// everywhere this is checked, TypeScript also learns `form` is genuinely a
// complete EmployeeDraft afterward, no separate `as EmployeeDraft` cast needed
function isCompleteDraft(form: EmployeeFormState): form is EmployeeDraft {
  return fields.every((field) => {
    const value = form[field.key]?.trim() ?? ''
    if (field.key === 'email') return isValidEmail(value)
    return !field.required || value.length > 0
  })
}

// <employee-form> - a dumb, reusable form. It doesn't own any list or store.
// main.ts hands it an employee to edit (or null, for a blank form) through the
// `employee` property; the form only ever announces what happened by
// dispatching "employee-save" with the finished record.
@customElement('employee-form')
export class EmployeeForm extends LitElement {
  // set from outside (by main.ts) - the employee to edit, or null for a new one
  @property({ attribute: false })
  employee: Employee | null = null

  //whatever the user currently has typed into the form
  @state()
  private form: EmployeeFormState = { ...emptyForm }

  // becomes true the first time Save is clicked - error messages only show after that
  @state()
  private submitted = false

  // the "Employee added successfully!" style banner text, or null when hidden
  @state()
  private toast: string | null = null

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null

  // Lit calls this whenever a reactive property changes, including `employee`
  // being set from outside - this is how the form reacts to prop-down data
  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (!changedProperties.has('employee')) return

    if (this.employee) {
      const { id, ...draft } = this.employee
      this.form = { ...draft }
    } else {
      this.form = { ...emptyForm }
    }
    this.submitted = false
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId)
    }
  }

  render() {
    return renderEmployeeForm({
      fields,
      form: this.form,
      isEditing: this.employee !== null,
      submitted: this.submitted,
      toast: this.toast,
      onFieldInput: (key, event) => this.handleInput(key, event),
      onSave: () => this.handleSave(),
      onClear: () => this.handleClear(),
      onDismissToast: () => this.dismissToast(),
    })
  }

  private handleInput(key: keyof EmployeeFormState, event: InputEvent): void {
    // genuine runtime check rather than an unverified claim - if this ever
    // isn't really an <input>, we just skip the update instead of crashing
    if (!(event.target instanceof HTMLInputElement)) return
    this.form = { ...this.form, [key]: event.target.value }
  }

  // runs on Save - builds a complete Employee (reusing the id if editing, a
  // fresh one otherwise) and just announces it; main.ts decides what to do with it
  private handleSave(): void {
    this.submitted = true
    if (!isCompleteDraft(this.form)) return

    // isCompleteDraft narrowed `this.form` to EmployeeDraft above - no cast needed
    const employeeToSave: Employee = {
      id: this.employee?.id ?? createId(),
      ...this.form,
    }

    this.dispatchEvent(
      new CustomEvent(employeeSaveEvent, {
        detail: employeeToSave,
        bubbles: true,
        composed: true,
      }),
    )

    this.showToast(this.employee ? 'Employee updated successfully!' : 'Employee added successfully!')
    this.resetForm()
  }

  private handleClear(): void {
    this.resetForm()
  }

  // explicit reset, rather than relying on willUpdate's `employee` change-detection -
  // when adding a brand new employee, `employee` is null before AND after this runs,
  // so Lit would never see it as "changed" and the form would never actually clear
  private resetForm(): void {
    this.employee = null
    this.form = { ...emptyForm }
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
