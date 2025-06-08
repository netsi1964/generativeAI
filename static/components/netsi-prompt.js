class NetsiPrompt extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'prompt', 'image', 'alt', 'title-link'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.render();
  }

  copyPrompt() {
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
  }

  render() {
    const title = this.getAttribute('title') || '';
    const titleLink = this.getAttribute('title-link') || '';
    const prompt = this.getAttribute('prompt') || '';
    const image = this.getAttribute('image') || '';
    const alt = this.getAttribute('alt') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --netsi-prompt-width: calc(100vw - 48px);
          --netsi-prompt-height: 25vh;
          display: block;
          margin: 12px;
        }
        :host([data-large]) {
          --netsi-prompt-height: 37.5vh;
        }
        @media (max-width: 600px) {
          :host {
            --netsi-prompt-width: calc(100vw - 48px);
            --netsi-prompt-height: 40vh;
            margin: 12px 0;
          }
          :host([data-large]) {
            --netsi-prompt-height: 60vh;
          }
        }
        * {
          box-sizing: border-box;
        }
        .prompt {
          margin-bottom: 0;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 2px 8px #0001;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          max-width: 100%;
        }
        .prompt-inner {
          padding: 8px;
        }
        .prompt-title {
          font-size: 1.3em;
          margin-bottom: 0.7em;
          margin-top: 0.7em;
          font-family: inherit;
        }
        .prompt-title a {
          text-decoration: none;
          color: inherit;
        }
        .prompt-text {
          background: none;
          padding: 0;
          border-radius: 6px;
          font-family: monospace;
          white-space: pre-wrap;
          font-size: 1em;
          margin: 0.5em 0 0 0;
        }
        .prompt-image {
          margin: 0;
        }
        .prompt-image a {
          display: block;
        }
        .prompt-image img {
          margin: 0;
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px #0002;
          width: 100%;
          max-width: var(--netsi-prompt-width, 25vw);
          max-height: var(--netsi-prompt-height, 25vh);
          height: var(--netsi-prompt-height, 25vh);
          display: block;
          object-fit: contain;
        }
        .copy-btn-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.2em;
        }
        .copy-btn {
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
        @media (max-width: 600px) {
          .prompt {
            max-width: 100vw;
          }
          .prompt-inner {
            padding: 12px;
          }
          .prompt-title {
            font-size: 1.1em;
            margin-top: 1em;
          }
          .prompt-text {
            font-size: 0.95em;
            padding: 0;
          }
          .prompt-image img {
            max-width: var(--netsi-prompt-width, 100vw);
            max-height: var(--netsi-prompt-height, 40vh);
            height: var(--netsi-prompt-height, 40vh);
          }
        }
        @media (max-width: 400px) {
          .prompt-title {
            font-size: 1em;
          }
          .prompt-text {
            font-size: 0.9em;
            padding: 0;
          }
        }
      </style>
      <div class="prompt">
        <div class="prompt-inner">
          ${
            titleLink
              ? `<h2 class="prompt-title"><a href="${titleLink}" target="_blank" rel="noopener">${title}</a></h2>`
              : `<h2 class="prompt-title">${title}</h2>`
          }
          ${image ? `
          <div class="prompt-image">
            <a href="${image}" target="_blank">
              <img src="${image}" alt="${alt}" />
            </a>
          </div>` : ''}
          ${prompt && !this.hasAttribute('hide-prompt') ? `
          <pre class="prompt-text">${prompt}</pre>
          <div class="copy-btn-row">
            <button class="copy-btn" id="copy-btn" title="Copy prompt">
              <svg viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="12" rx="2" /><rect x="7" y="3" width="10" height="12" rx="2" fill="none" stroke="#2196f3" stroke-width="1.5"/></svg>
              <span class="copy-label">Copy</span>
            </button>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    // Add copy functionality if prompt exists and not hidden
    if (prompt && !this.hasAttribute('hide-prompt')) {
      const btn = this.shadowRoot.getElementById('copy-btn');
      if (btn) {
        btn.onclick = () => this.copyPrompt();
      }
    }
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('netsi-prompt', NetsiPrompt);
