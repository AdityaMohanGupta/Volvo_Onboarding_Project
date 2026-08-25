import { css } from 'lit'

// scoped to this component's shadow DOM only - won't clash with or leak to the rest of the page
export const employeeFormStyles = css`
  :host {
    --color-bg: #f5f5f5;
    --color-text: #1c1c1e;
    --color-text-muted: #8e8e93;
    --color-border: #dcdce1;
    --color-input-bg: #fafafb;
    --color-input-bg-focus: #fff;
    --color-input-border: #d7d7dc;
    --color-primary: #3a4cd0;
    --color-secondary-bg: #e9e9ee;
    --color-danger-text: #d5303f;
    --color-success-bg: #e6f7ec;
    --color-success-border: #b8e6c4;
    --color-success-icon: #22a55e;

    color-scheme: light dark;
    display: block;
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
    color: var(--color-text);
  }

  /* dark theme - only the values that actually need to change get overridden */
  @media (prefers-color-scheme: dark) {
    :host {
      --color-bg: #1f2028;
      --color-text: #f3f4f6;
      --color-text-muted: #9ca3af;
      --color-border: #2e303a;
      --color-input-bg: #26272f;
      --color-input-bg-focus: #1f2028;
      --color-input-border: #3a3b45;
      --color-secondary-bg: #2c2d36;
      --color-danger-text: #ff8a95;
      --color-success-bg: #16301f;
      --color-success-border: #245234;
      --color-success-icon: #4ade80;
    }
  }

  .card {
    /* explicit width (not just max-width) - the parent lays this out with flexbox
       align-items:center, which shrinks each card to its own content otherwise, so
       <employee-form> and <employee-table> would end up different widths */
    width: 960px;
    max-width: 100%;
    margin: 0 auto;
    padding: 32px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
    box-sizing: border-box;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    margin-bottom: 24px;
    border: 1px solid var(--color-success-border);
    border-radius: 8px;
    background: var(--color-success-bg);
  }

  .toast-icon {
    display: flex;
    flex-shrink: 0;
    color: var(--color-success-icon);
  }

  .toast-message {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
  }

  .toast-close {
    display: flex;
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 4px;
    color: var(--color-text-muted);
    cursor: pointer;
  }

  h1 {
    margin: 0 0 28px;
    font-size: 28px;
    font-weight: 700;
  }

  .fields {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  .required-mark {
    color: var(--color-danger-text);
    margin-left: 2px;
  }

  .field-error {
    color: var(--color-danger-text);
    font-size: 12px;
    font-weight: 500;
  }

  input {
    font: inherit;
    font-weight: 400;
    color: var(--color-text);
    padding: 10px 12px;
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    background: var(--color-input-bg);
    box-sizing: border-box;
  }

  input:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
    background: var(--color-input-bg-focus);
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    font: inherit;
    font-weight: 600;
    font-size: 14px;
    padding: 10px 22px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--color-primary);
    color: #fff;
  }

  .btn-secondary {
    background: var(--color-secondary-bg);
    color: var(--color-text);
  }

  @media (max-width: 720px) {
    .fields {
      grid-template-columns: 1fr;
    }
  }
`
