let root = null;
let nav = null;
let content = null;

async function loadContent() {
  if (!content) {
    const res = await fetch('static/data/content.json');
    content = await res.json();
  }
}

function renderNav() {
  nav.innerHTML = `
    <style>
      #main-nav {
        background: #f6f6f6;
        padding: 0.5em 1em;
        margin-bottom: 1.5em;
      }
      #main-nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5em;
        align-items: center;
      }
      #main-nav li {
        display: inline-block;
        position: relative;
      }
      #main-nav a {
        text-decoration: none;
        color: #1976d2;
        font-weight: 700;
        padding: 0.4em 0.8em;
        border-radius: 4px 4px 0 0;
        transition: background 0.2s, color 0.2s;
        display: inline-block;
      }
      #main-nav a.active, #main-nav a:hover {
        background: #1976d2;
        color: #fff;
      }
      .menu-section {
        margin-left: 2em;
        display: flex;
        flex-direction: column;
        gap: 0.2em;
      }
      .menu-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1.2em;
        margin: 0.2em 0 0 0;
        padding: 0;
        list-style: none;
      }
      .menu-list a {
        font-weight: 700;
        color: #1976d2;
        text-decoration: none;
        padding: 0;
        background: none;
        border-radius: 0;
      }
      .menu-list a:hover, .menu-list a.active {
        text-decoration: underline;
        background: none;
        color: #1976d2;
      }
      @media (max-width: 900px) {
        #main-nav ul { flex-wrap: wrap; gap: 0.7em; }
        .menu-section { margin-left: 0.5em; }
        .menu-list { gap: 0.5em; }
      }
      @media (max-width: 600px) {
        #main-nav ul { flex-direction: column; gap: 0.3em; }
        .menu-section { margin-left: 0; }
        .menu-list { gap: 0.2em; }
      }
      #main-nav li.dropdown {
        position: relative;
      }
      #main-nav .dropdown-content {
        display: none;
        position: absolute;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        top: 100%;
        left: 0;
        z-index: 10;
        min-width: 200px;
      }
      #main-nav .dropdown-content li {
        display: block;
      }
      #main-nav .dropdown:hover .dropdown-content {
        display: block;
      }
      #main-nav .dropdown-content a {
        display: block;
        padding: 0.4em 1em;
        color: #1976d2;
        text-decoration: none;
      }
      #main-nav .dropdown-content a:hover {
        background: #e3f2fd;
      }
    </style>
    <ul>
      <li><a href="#/">Home</a></li>
      <li class="dropdown">
        <a href="#">Services</a>
        <ul class="dropdown-content">
          ${content.services.map(s => `<li><a href="#/service/${s.id}">${s.name}</a></li>`).join('')}
        </ul>
      </li>
      <li class="dropdown">
        <a href="#">Prompts</a>
        <ul class="dropdown-content">
          ${content.prompts.map(p => `<li><a href="#/prompt/${p.id}">${p.title}</a></li>`).join('')}
        </ul>
      </li>
      <li><a href="#/styles">Styles</a></li>
    </ul>
  `;
}

function renderService(service) {
  const tmpl = document.getElementById('service-template').content.cloneNode(true);
  tmpl.querySelector('.service-title').textContent = service.name;
  tmpl.querySelector('.service-description').textContent = service.description;
  const promptsEl = tmpl.querySelector('netsi-prompts');
  promptsEl.setAttribute('title', service.name);
  promptsEl.setAttribute('prompt', '');

  service.prompts.forEach(pid => {
    let idAndExt = pid;
    let customPrompt = null;
    const firstColon = pid.indexOf(':');
    if (firstColon !== -1) {
      idAndExt = pid.slice(0, firstColon);
      customPrompt = pid.slice(firstColon + 1).replace(/^'+|'+$/g, '');
    }
    const [promptId, ext] = idAndExt.split('.');
    const promptObj = content.prompts.find(p => p.id === promptId);
    if (!promptObj) return;
    let filename = promptObj.filename;
    if (ext) filename = filename.replace(/\.[^.]+$/, '.' + ext);

    // Make prompt title a link to the prompt page
    const el = document.createElement('netsi-prompt');
    el.setAttribute('title', `<a href="#/prompt/${promptObj.id}">${promptObj.title}</a>`);
    el.setAttribute('prompt', customPrompt ? customPrompt : promptObj.prompt);
    el.setAttribute('image', service.imageFolder.replace(/\/+$/, '') + '/' + filename);
    el.setAttribute('alt', promptObj.title);
    promptsEl.appendChild(el);
  });

  root.innerHTML = '';
  root.appendChild(tmpl);
}

function renderTips() {
  const tmpl = document.getElementById('tips-template').content.cloneNode(true);
  const tipsList = tmpl.querySelector('.tips-list');
  content.tips.forEach(tip => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${tip.title}</h3><p>${tip.content}</p>`;
    tipsList.appendChild(div);
  });
  root.innerHTML = '';
  root.appendChild(tmpl);
}

function renderTools() {
  const tmpl = document.getElementById('tools-template').content.cloneNode(true);
  const toolsList = tmpl.querySelector('.tools-list');
  content.tools.forEach(tool => {
    const div = document.createElement('div');
    div.innerHTML = `<a href="${tool.url}" target="_blank">${tool.title}</a>`;
    toolsList.appendChild(div);
  });
  root.innerHTML = '';
  root.appendChild(tmpl);
}

function renderStyles() {
  const tmpl = document.getElementById('styles-template').content.cloneNode(true);
  const disclaimer = `Public domain laws are complex and differ by country. In the USA, works published before January 1, 1928, are generally in the public domain. Works from 1929 enter the public domain on January 1, 2025. In the European Union, copyright typically lasts for 70 years after the death of the last surviving creator. This list, current as of June 30, 2025, refers to the **earliest versions** of these characters and series. Later versions or specific elements may still be under copyright.`;
  tmpl.querySelector('.disclaimer').textContent = disclaimer.replace(/\*\*/g, "");
  const promptsEl = tmpl.querySelector('netsi-prompts');

  content.styles.forEach(style => {
    const el = document.createElement('netsi-prompt');
    const image = `images/styles/${style.id}.png`;
    const info = `${style.info} Artist: ${style.artist}. EU: ${
      style.eu ? "✅" : "❌"
    } / USA: ${style.usa ? "✅" : "❌"}`;

    el.setAttribute('title', style.style);
    el.setAttribute('prompt', style.stylePrompt);
    el.setAttribute('image', image);
    el.setAttribute('alt', style.style);
    el.setAttribute('info', info);
    promptsEl.appendChild(el);
  });

  root.innerHTML = '';
  root.appendChild(tmpl);
}

function renderHome() {
  root.innerHTML = `<h1>Welcome to Generative AI SPA</h1>`;
}

function renderPrompt(promptId) {
  const prompt = content.prompts.find(p => p.id === promptId);
  if (!prompt) {
    root.innerHTML = `<p>Prompt not found.</p>`;
    return;
  }
  // Find all services that use this prompt
  const services = content.services.filter(s =>
    s.prompts.some(pid => {
      const firstColon = pid.indexOf(':');
      const idAndExt = firstColon === -1 ? pid : pid.slice(0, firstColon);
      const [id] = idAndExt.split('.');
      return id === promptId;
    })
  );
  // Byg alle netsi-prompt cards uden prompt-tekst for eksempler
  const promptCards = services.map(service => {
    const pid = service.prompts.find(pid => {
      const firstColon = pid.indexOf(':');
      const idAndExt = firstColon === -1 ? pid : pid.slice(0, firstColon);
      const [id] = idAndExt.split('.');
      return id === promptId;
    });

    let idAndExt = pid;
    let customPrompt = null;
    const firstColon = pid.indexOf(':');
    if (firstColon !== -1) {
      idAndExt = pid.slice(0, firstColon);
      customPrompt = pid.slice(firstColon + 1).replace(/^'+|'+$/g, '');
    }
    const [id, ext] = idAndExt.split('.');
    let filename = prompt.filename;
    if (ext) {
      filename = filename.replace(/\.[^.]+$/, '.' + ext);
    }
    const imageUrl = service.imageFolder.replace(/\/+$/, '') + '/' + filename;
    // Always show prompt (custom if present, otherwise default)
    const promptText = customPrompt ? customPrompt : prompt.prompt;
    return `
      <netsi-prompt
        title="${service.name}"
        title-link="#/service/${service.id}"
        image="${imageUrl}"
        prompt="${promptText.replace(/"/g, '&quot;')}"
        alt="${prompt.title}"
        data-large
        hide-prompt
      ></netsi-prompt>
    `;
  }).join('');

  root.innerHTML = `
    <netsi-prompts
      title="${prompt.title}"
      prompt="${prompt.prompt.replace(/"/g, '&quot;')}"
    >
      ${promptCards}
    </netsi-prompts>
  `;
}

async function router() {
  // Ensure DOM elements exist
  if (!root) root = document.getElementById('spa-root');
  if (!nav) nav = document.getElementById('main-nav');
  
  if (!root || !nav) {
    console.error('SPA elements not found: spa-root or main-nav');
    return;
  }
  
  await loadContent();
  renderNav();
  const path = window.location.hash.slice(1) || '/';
  const parts = path.split('/');
  
  if (parts[1] === 'service' && parts[2]) {
    const service = content.services.find(s => s.id === parts[2]);
    renderService(service);
  } else if (parts[1] === 'prompt' && parts[2]) {
    renderPrompt(parts[2]);
  } else if (parts[1] === 'tips') {
    renderTips();
  } else if (parts[1] === 'tools') {
    renderTools();
  } else if (parts[1] === 'styles') {
    renderStyles();
  } else {
    renderHome();
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    router();
  });
} else {
  router();
}
window.addEventListener('hashchange', router);
