import { expect } from '@open-wc/testing'
import { isValidEmail } from '../src/utils/validation'

describe('isValidEmail', () => {
  it('accepts a normal email', () => {
    expect(isValidEmail('john@example.com')).to.be.true
  })

  it('rejects an empty string', () => {
    expect(isValidEmail('')).to.be.false
  })

  it('rejects a string with no @', () => {
    expect(isValidEmail('johnexample.com')).to.be.false
  })

  it('rejects a string with no domain dot', () => {
    expect(isValidEmail('john@example')).to.be.false
  })

  it('rejects a string containing spaces', () => {
    expect(isValidEmail('john doe@example.com')).to.be.false
  })

  it('ignores leading/trailing whitespace', () => {
    expect(isValidEmail('  john@example.com  ')).to.be.true
  })
})
