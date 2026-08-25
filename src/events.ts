// shared event names - employee-form and employee-table agree on these without
// needing a third component to wire them together

// dispatched by <employee-form> when Save/Update is clicked on a valid form
export const employeeSaveEvent = 'employee-save'

// dispatched by <employee-table> when its Edit button is clicked
export const employeeEditEvent = 'employee-edit'

// dispatched by <employee-table> when its Delete button is clicked
export const employeeDeleteEvent = 'employee-delete'
