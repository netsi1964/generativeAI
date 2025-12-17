class NetsiNavigation extends HTMLElement {
  connectedCallback() {
    const repoName = 'generativeAI';
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const basePath =
      pathSegments.length > 0 && pathSegments[0] === repoName
        ? `/${repoName}`
        : '';
    const spaPrefix = `${basePath || ''}/index.html`;
    const promptToolPath = `${basePath || ''}/tools/prompt-composition-tool.html`;

    this.innerHTML = `
      <style>
        .navbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          padding: 0 1em;
          background: #f6f6f6;
        }
        .navbar > ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }
        .navbar > ul > li {
          position: relative;
        }
        .navbar a {
          text-decoration: none;
          color: #1976d2;
          font-weight: 500;
          padding: 0.7em 1em;
          display: block;
          border-radius: 4px 4px 0 0;
          transition: background 0.2s, color 0.2s;
        }
        .navbar a.active, .navbar a:hover, .navbar li:hover > a {
          background: #1976d2;
          color: #fff;
        }
        .dropdown {
          display: none;
          position: absolute;
          left: 0;
          top: 100%;
          min-width: 220px;
          background: #fff;
          box-shadow: 0 4px 16px #0002;
          border-radius: 0 0 6px 6px;
          z-index: 10;
          padding: 0.5em 0;
        }
        .navbar li:hover > .dropdown,
        .navbar li:focus-within > .dropdown {
          display: block;
        }
        .dropdown li {
          width: 100%;
        }
        .dropdown a {
          color: #1976d2;
          background: none;
          border-radius: 0;
          padding: 0.6em 1.2em;
        }
        .dropdown a:hover, .dropdown a.active {
          background: #e3eafc;
          color: #1976d2;
        }
        @media (max-width: 800px) {
          .navbar > ul { flex-direction: column; gap: 0; }
          .navbar > ul > li { width: 100%; }
          .navbar a { border-radius: 0; }
          .dropdown { position: static; box-shadow: none; border-radius: 0; }
        }
      </style>
      <div class="navbar">
        <ul>
          <li><a href="${spaPrefix}#/">Home</a></li>
          <li><a href="${promptToolPath}">Prompt Tool</a></li>
          <li><a href="${spaPrefix}#/tools">Tools</a></li>
          <li><a href="${spaPrefix}#/styles">Styles</a></li>
          <li tabindex="0">
            <a href="javascript:void(0)">Services ▼</a>
            <ul class="dropdown">
              <li><a href="${spaPrefix}#/service/grok3">Grok 3</a></li>
              <li><a href="${spaPrefix}#/service/gpt4o">GPT-4o</a></li>
              <li><a href="${spaPrefix}#/service/imagen30">Google Imagen 3.0</a></li>
              <li><a href="${spaPrefix}#/service/lexica.art">lexica.art</a></li>
              <li><a href="${spaPrefix}#/service/clipdrop.co">clipdrop.co</a></li>
              <li><a href="${spaPrefix}#/service/chat.openai.com">Dall-e3 (chat.openai.com)</a></li>
              <li><a href="${spaPrefix}#/service/app.leonardo.ai">app.leonardo.ai</a></li>
              <li><a href="${spaPrefix}#/service/runwayml.com">runwayml.com</a></li>
              <li><a href="${spaPrefix}#/service/playground.com">playground.com</a></li>
              <li><a href="${spaPrefix}#/service/midjourney">midjourney</a></li>
            </ul>
          </li>
          <li tabindex="0">
            <a href="javascript:void(0)">Prompts ▼</a>
            <ul class="dropdown">
              <li><a href="${spaPrefix}#/prompt/be-happy">80s-Inspired 'Be Happy' Sticker with Thumbs-Up</a></li>
              <li><a href="${spaPrefix}#/prompt/thai-woman">A thai woman</a></li>
              <li><a href="${spaPrefix}#/prompt/cityscape-night">Surreal Cityscape at Night</a></li>
              <li><a href="${spaPrefix}#/prompt/awakening-forest">The Awakening of an Ancient Forest</a></li>
              <li><a href="${spaPrefix}#/prompt/melancholy-paris">The Melancholy of a Rainy Parisian Street</a></li>
              <li><a href="${spaPrefix}#/prompt/family-thailand">Family Vacation Bliss in Thailand</a></li>
              <li><a href="${spaPrefix}#/prompt/vulture-photo">A photograph of a vulture</a></li>
              <li><a href="${spaPrefix}#/prompt/sketch-woman-cliff">A sketch of a woman standing on a cliff looking at the sea in a fancy art style</a></li>
              <li><a href="${spaPrefix}#/prompt/hopeful-coffee">Hopeful Gaze in Coffee Tones</a></li>
            </ul>
          </li>
        </ul>
      </div>
    `;

    // SPA navigation: intercept clicks on <a> with href containing #/
    this.querySelectorAll('a[href*="#/"]').forEach(link => {
      link.addEventListener('click', e => {
        if (
          e.button === 0 &&
          !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
        ) {
          e.preventDefault();
          const href = link.getAttribute('href');
          const hashIndex = href.indexOf('#/');
          if (hashIndex !== -1) {
            if (
              window.location.pathname.endsWith('/index.html') ||
              window.location.pathname === '/index.html'
            ) {
              window.location.hash = href.slice(hashIndex);
              window.scrollTo(0, 0);
            } else {
              window.location.href = spaPrefix + href.slice(hashIndex - 0);
            }
          }
        }
      });
    });
  }
}
customElements.define('netsi-navigation', NetsiNavigation);
