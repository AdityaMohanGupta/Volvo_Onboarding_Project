import { css } from 'lit'

// scoped to this component's shadow DOM only - won't clash with or leak to the rest of the page
export const employeeManagementStyles = css`
  :host {
    display: block;
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
    color: #1c1c1e;
  }

  .card {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px;
    border: 1px solid #dcdce1;
    border-radius: 12px;
    background: #fff;
    box-sizing: border-box;
  }

  h1 {
    margin: 0 0 28px;
    font-size: 28px;
    font-weight: 700;
  }

  h2 {
    margin: 0 0 20px;
    font-size: 20px;
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

  input {
    font: inherit;
    font-weight: 400;
    padding: 10px 12px;
    border: 1px solid #d7d7dc;
    border-radius: 8px;
    background: #fafafb;
    box-sizing: border-box;
  }

  input:focus {
    outline: 2px solid #3a4cd0;
    outline-offset: 1px;
    background: #fff;
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
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

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .btn-primary {
    background: #3a4cd0;
    color: #fff;
  }

  .btn-secondary {
    background: #e9e9ee;
    color: #1c1c1e;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e5ea;
    margin: 0 0 24px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th {
    text-align: left;
    padding: 12px 8px;
    background: #f7f7f9;
    font-weight: 700;
    border-bottom: 1px solid #e5e5ea;
  }

  td {
    padding: 14px 8px;
    border-bottom: 1px solid #efeff2;
  }

  .empty {
    text-align: center;
    color: #8e8e93;
    padding: 24px 8px;
  }

  .actions-col {
    display: flex;
    gap: 8px;
  }

  .btn-edit {
    background: #3a4cd0;
    color: #fff;
    padding: 6px 14px;
  }

  .btn-delete {
    background: #fbe3e6;
    color: #d5303f;
    padding: 6px 14px;
  }

  @media (max-width: 720px) {
    .fields {
      grid-template-columns: 1fr;
    }

    table {
      display: block;
      overflow-x: auto;
    }
  }
`
