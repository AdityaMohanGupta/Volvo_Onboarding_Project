import type { Employee } from './models/employee'

// shared event names - employee-form and employee-table agree on these without
// needing a third component to wire them together

// dispatched by <employee-form> when Save/Update is clicked on a valid form
export const employeeSaveEvent = 'employee-save'

// dispatched by <employee-table> when its Edit button is clicked
export const employeeEditEvent = 'employee-edit'

// dispatched by <employee-table> when its Delete button is clicked
export const employeeDeleteEvent = 'employee-delete'

// teaches TypeScript what each event actually carries. Because the constants
// above are declared with `const`, TypeScript already infers their narrowest
// possible type (the literal 'employee-save', not the wide `string`) - this
// augmentation is what lets that literal type connect to a real payload type,
// so addEventListener(employeeSaveEvent, ...) infers `event: CustomEvent<Employee>`
// automatically, with no `as CustomEvent<...>` cast needed at the call site
declare global {
  interface HTMLElementEventMap {
    'employee-save': CustomEvent<Employee>
    'employee-edit': CustomEvent<Employee>
    'employee-delete': CustomEvent<string>
  }
}
