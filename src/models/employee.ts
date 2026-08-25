//model for a single employee record.

export interface Employee {
  id: string
  name: string
  department: string
  designation: string
  email: string
}

//before id generation the form produces values.

export type EmployeeDraft = Omit<Employee, 'id'>

//Form state is a partial draft

export type EmployeeFormState = Partial<EmployeeDraft>

//payload of the "employee-save" event <employee-form> dispatches
//id is null when adding a new employee, set when updating an existing one

export interface EmployeeSaveDetail {
  id: string | null
  draft: EmployeeDraft
}
