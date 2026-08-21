import { html } from 'lit'

// small inline icons, styled via currentColor so CSS controls their color
// defined once at module load and reused - they're static, no bindings inside

export const checkCircleIcon = html`
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="currentColor" />
    <path d="M6 10.3L8.6 13L14 7.3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`

export const closeIcon = html`
  <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
`

export const pencilIcon = html`
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M13.4 3.4a1.4 1.4 0 0 1 2 2L6.8 14.9l-2.8.6.6-2.8L13.4 3.4Z"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
    />
  </svg>
`

export const trashIcon = html`
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6M6.5 6l.6 9a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-9"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`
