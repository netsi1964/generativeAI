class NetsiPrompts extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'prompt'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const prompt = this.getAttribute('prompt') || '';

    this.shadowRoot.innerHTML = `
      <style>
        .prompt-title {
          font-size: 1.3em;
          margin-bottom: 0.3em;
          margin-top: 0;
          font-family: inherit;
        }
        .prompt-text {
          font-family: monospace;
          white-space: pre-wrap;
          font-size: 1em;
          margin: 0 0 1em 0;
          user-select: all;
          background: #f6f6f6;
          border-radius: 6px;
          padding: 0.5em 2.5em 0.5em 0.5em;
          position: relative;
        }
        .copy-btn {
          position: absolute;
          top: -2.2em;
          right: 0.6em;
          background: #fff;
          border: 1px solid #bbb;
          border-radius: 4px;
          padding: 4px 8px 4px 8px;
          font-size: 1em;
          cursor: pointer;
          opacity: 0.8;
          display: flex;
          align-items: center;
          gap: 0.3em;
          box-shadow: 0 1px 4px #0001;
          transition: background 0.2s, border 0.2s, opacity 0.2s;
        }
        .copy-btn:hover, .copy-btn:focus {
          background: #e6f7ff;
          border: 1px solid #2196f3;
          opacity: 1;
        }
        .copy-btn svg {
          width: 1em;
          height: 1em;
          display: inline-block;
          vertical-align: middle;
          fill: #2196f3;
        }
        .copy-btn.copied {
          color: #219653;
          border-color: #219653;
          background: #eafbe7;
        }
        .prompts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5em;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        @media (min-width: 900px) {
          .prompts {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 900px) and (min-width: 600px) {
          .prompts {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .prompts {
            grid-template-columns: 1fr;
            gap: 0.7em;
          }
          .prompt-title {
            font-size: 1.1em;
          }
          .prompt-text {
            font-size: 0.95em;
          }
        }
        @media (max-width: 400px) {
          .prompt-title {
            font-size: 1em;
          }
          .prompt-text {
            font-size: 0.9em;
          }
        }
      </style>
      <h2 class="prompt-title">${title}</h2>
      <div style="position:relative;">
        <button class="copy-btn" id="copy-btn" title="Copy prompt">
          <svg viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="12" rx="2" /><rect x="7" y="3" width="10" height="12" rx="2" fill="none" stroke="#2196f3" stroke-width="1.5"/></svg>
          <span class="copy-label">Copy</span>
        </button>
        <pre class="prompt-text" id="prompt-text">${prompt}</pre>
      </div>
      <div class="prompts">
        <slot></slot>
      </div>
    `;

    // Add copy functionality
    this.shadowRoot.getElementById('copy-btn').onclick = () => {
      const prompt = this.getAttribute('prompt') || '';
      navigator.clipboard.writeText(prompt);
      const btn = this.shadowRoot.getElementById('copy-btn');
      if (btn) {
        const label = btn.querySelector('.copy-label');
        btn.classList.add('copied');
        if (label) label.textContent = 'copied!';
        btn.disabled = true;
        setTimeout(() => {
          btn.classList.remove('copied');
          if (label) label.textContent = 'Copy';
          btn.disabled = false;
        }, 2000);
      }
    };
  }
}

customElements.define('netsi-prompts', NetsiPrompts);
