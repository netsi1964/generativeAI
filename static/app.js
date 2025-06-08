const root = document.getElementById('spa-root');
const nav = document.getElementById('main-nav');
let content = null;

async function loadContent() {
  if (!content) {
    const res = await fetch('static/data/content.json');
    content = await res.json();
  }
}

function renderNav() {
  nav.innerHTML = `
    <a href="#/">Home</a>
    <a href="#/tips">Tips</a>
    <a href="#/tools">Tools</a>
    ${content.services.map(s => `<a href="#/service/${s.id}">${s.name}</a>`).join('')}
  `;
}

function renderService(service) {
  const tmpl = document.getElementById('service-template').content.cloneNode(true);
  tmpl.querySelector('.service-title').textContent = service.name;
  tmpl.querySelector('.service-description').textContent = service.description;
  const promptsEl = tmpl.querySelector('netsi-prompts');
  promptsEl.setAttribute('title', service.name);
  promptsEl.setAttribute('prompt', '');
  service.prompts.forEach(p => {
    const el = document.createElement('netsi-prompt');
    el.setAttribute('title', p.title);
    el.setAttribute('prompt', p.prompt);
    if (p.image) el.setAttribute('image', p.image);
    if (p.alt) el.setAttribute('alt', p.alt);
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

function renderHome() {
  root.innerHTML = `<h1>Welcome to Generative AI SPA</h1>`;
}

async function router() {
  await loadContent();
  renderNav();
  const hash = location.hash.replace(/^#\//, '');
  if (!hash || hash === '') {
    renderHome();
  } else if (hash === 'tips') {
    renderTips();
  } else if (hash === 'tools') {
    renderTools();
  } else if (hash.startsWith('service/')) {
    const id = hash.split('/')[1];
    const service = content.services.find(s => s.id === id);
    if (service) renderService(service);
    else root.innerHTML = '<p>Service not found</p>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
