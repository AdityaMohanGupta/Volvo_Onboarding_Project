import { html } from 'lit'
import type { EmployeeFormState } from '../../models/employee'
import { isValidEmail } from '../../utils/validation'
import { checkCircleIcon, closeIcon } from '../../assets/icons'

// shape of one form field's config
interface Field {
  readonly key: keyof EmployeeFormState
  readonly label: string
  readonly placeholder: string
  readonly required: boolean
}

// everything the template needs - passed in as plain data + callbacks, no access to component internals
export interface EmployeeFormViewProps {
  fields: readonly Field[]
  form: EmployeeFormState
  isEditing: boolean
  submitted: boolean
  toast: string | null
  onFieldInput: (key: keyof EmployeeFormState, event: InputEvent) => void
  onSave: () => void
  onClear: () => void
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
  onFieldInput: EmployeeFormViewProps['onFieldInput'],
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

// describes what should be on screen, based on current state
export function renderEmployeeForm(props: EmployeeFormViewProps) {
  const { fields, form, isEditing, submitted, toast, onFieldInput, onSave, onClear, onDismissToast } = props

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

      <h1>Employee Form</h1>

      <div class="fields">
        ${fields.map((field) => renderField(field, form, submitted, onFieldInput))}
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="button" @click=${onSave}>
          ${isEditing ? 'Update' : 'Save'}
        </button>
        <button class="btn btn-secondary" type="button" @click=${onClear}>Clear</button>
      </div>
    </div>
  `
}
