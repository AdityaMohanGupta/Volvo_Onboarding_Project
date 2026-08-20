/**
 * Domain model for a single employee record.
 */
export interface Employee {
  id: string
  name: string
  department: string
  designation: string
  email: string
}

/**
 * Shape of an employee before it has an id (i.e. what the form produces).
 */
export type EmployeeDraft = Omit<Employee, 'id'>

/**
 * Form state is a partial draft — fields start empty and fill in as the
 * user types, so nothing is guaranteed to be present yet.
 */
export type EmployeeFormState = Partial<EmployeeDraft>
