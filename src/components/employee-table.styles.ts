import { css } from 'lit'

// scoped to this component's shadow DOM only - won't clash with or leak to the rest of the page
export const employeeTableStyles = css`
  :host {
    --color-bg: #f5f5f5;
    --color-text: #1c1c1e;
    --color-text-muted: #8e8e93;
    --color-border: #dcdce1;
    --color-border-soft: #efeff2;
    --color-primary: #3a4cd0;
    --color-table-header-bg: #f7f7f9;
    --color-danger-bg: #fbe3e6;
    --color-danger-text: #d5303f;
    --color-success-bg: #e6f7ec;
    --color-success-border: #b8e6c4;
    --color-success-icon: #22a55e;

    color-scheme: light dark;
    display: block;
    /* body (index.css) lays this out with flexbox - without this, a flex item won't shrink
       below its content's natural min-width, so the 640px-wide table would stretch the whole
       component instead of scrolling inside its own .table-scroll container */
    min-width: 0;
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
      --color-border-soft: #2a2b33;
      --color-table-header-bg: #24252c;
      --color-danger-bg: #3a2228;
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
    margin: 0 0 20px;
    font-size: 20px;
    font-weight: 700;
  }

  /* .table is the ONE shared grid, .row is display:contents so it contributes no box of its
     own and its .cells become direct children of that single grid - this is what keeps every
     row's columns pixel-aligned, header included */
  .table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    font-size: 14px;
  }

  .row {
    display: contents;
  }

  .cell {
    display: flex;
    align-items: center;
    padding: 14px 8px;
    text-align: left;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .row.head .cell {
    background: var(--color-table-header-bg);
    font-weight: 700;
    border-bottom: 1px solid var(--color-border);
  }

  .empty {
    grid-column: 1 / -1;
    text-align: center;
    color: var(--color-text-muted);
    padding: 24px 8px;
  }

  .actions-col {
    gap: 8px;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
  }

  .icon-btn.edit {
    color: var(--color-primary);
  }

  .icon-btn.delete {
    color: var(--color-danger-text);
  }

  .icon-btn.edit:hover {
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  }

  .icon-btn.delete:hover {
    background: var(--color-danger-bg);
  }

  @media (max-width: 720px) {
    .table-scroll {
      overflow-x: auto;
    }

    .table {
      min-width: 640px;
    }
  }
`
