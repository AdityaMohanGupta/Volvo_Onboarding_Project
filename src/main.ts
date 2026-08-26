// This file is the only place that knows both <employee-form> and
// <employee-table> exist. Neither component imports or references the
// other - they only emit events (employee-save, employee-edit,
// employee-delete) and accept plain data through their own properties.
// This file's job is entirely to hold the shared employee list and pass
// data + events between the two.
import './styles/global.css'
import './components/employee-form/employee-form'
import './components/employee-table/employee-table'
import type { Employee } from './models/employee'
import { EntityStore } from './store/entity-store'
import { employeeDeleteEvent, employeeEditEvent, employeeSaveEvent } from './events'

const logPrefix = '[main]'

function getRequiredElement<TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
): HTMLElementTagNameMap[TagName] {
  const element = document.querySelector(tagName)
  if (element === null) {
    throw new Error(`${logPrefix} expected a <${tagName}> element in the page`)
  }
  return element
}

const employeeFormElement = getRequiredElement('employee-form')
const employeeTableElement = getRequiredElement('employee-table')

const store = new EntityStore<Employee>()

function updateEmployeeTableElement(): void {
  employeeTableElement.employees = store.all
}

employeeFormElement.addEventListener(employeeSaveEvent, (event) => {
  const employeeToSave = (event as CustomEvent<Employee>).detail

  if (store.find(employeeToSave.id)) {
    const { id, ...draft } = employeeToSave
    store.update(id, draft)
  } else {
    store.add(employeeToSave)
  }

  updateEmployeeTableElement()
})

employeeTableElement.addEventListener(employeeEditEvent, (event) => {
  const employeeToEdit = (event as CustomEvent<Employee>).detail
  employeeFormElement.employee = employeeToEdit
})

employeeTableElement.addEventListener(employeeDeleteEvent, (event) => {
  const employeeIdToDelete = (event as CustomEvent<string>).detail
  store.remove(employeeIdToDelete)
  updateEmployeeTableElement()

  // if the row being deleted is the one currently loaded into the form, the
  // form would otherwise keep showing data for an employee that no longer
  // exists - clearing it avoids saving a "resurrected" record
  if (employeeFormElement.employee?.id === employeeIdToDelete) {
    employeeFormElement.employee = null
  }
})
