import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../styles/global.css'
import '../widgets/employee-widget'

// <app-shell> - the real entry point now (index.html loads this file
// directly). It's the outermost piece: page-level chrome (a nav bar) wrapping
// the actual feature. Holds no employee data itself - it just mounts
// <employee-widget>, which does.
@customElement('app-shell')
export class AppShell extends LitElement {
  render() {
    return html`
      <header class="nav">
        <span class="tagline">Employee Management</span>
      </header>
      <main>
        <employee-widget></employee-widget>
      </main>
    `
  }

  static styles = css`
    :host {
      --color-bg: #fff;
      --color-text: #1c1c1e;
      --color-text-muted: #8e8e93;
      --color-border: #dcdce1;
      --color-primary: #3a4cd0;

      display: block;
      min-height: 100svh;
      font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
      color: var(--color-text);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --color-bg: #1f2028;
        --color-text: #f3f4f6;
        --color-text-muted: #9ca3af;
        --color-border: #2e303a;
      }
    }

    .nav {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding: 20px 32px;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .brand {
      font-size: 18px;
      font-weight: 700;
      color: var(--color-primary);
    }

    .tagline {
      font-size: 14px;
      color: var(--color-text-muted);
    }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 40px 20px;
      box-sizing: border-box;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'app-shell': AppShell
  }
}
