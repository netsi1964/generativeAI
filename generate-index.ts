import { createTextFile } from "./utils.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";

const HELP = `
This script generates the main index.html file for the website.

When to use it:
- When you have added or removed prompt or service pages and need to update the main navigation.

How to use it:
- deno task index
- deno run --allow-read --allow-write generate-index.ts

What it does:
- It scans the 'prompts' and 'services' directories for HTML files.
- It generates a sorted list of links to the prompt and service pages.
- It creates a new index.html file with these lists.
`;

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

// Function to generate the index.html content
async function generateIndexContent() {
  // Generate the sorted prompts list
  let promptsListHTML = `<h2>Generated images compared</h2><ul>`;
  let promptEntries = [];
  for await (const dirEntry of walk("prompts", { exts: [".html"] })) {
    promptEntries.push(dirEntry.name.replace(".html", ""));
  }
  promptEntries = promptEntries.sort((a, b) => a.localeCompare(b));
  for (const promptName of promptEntries) {
    promptsListHTML +=
      `<li><a href="prompts/${promptName}.html">${promptName}</a></li>`;
  }
  promptsListHTML += `</ul>`;

  // Generate the sorted services list
  let servicesListHTML = `<h3>GenerativeAI services</h3><ul>`;
  let serviceEntries = [];
  for await (const dirEntry of walk("services", { exts: [".html"] })) {
    serviceEntries.push(dirEntry.name.replace(".html", ""));
  }
  serviceEntries = serviceEntries.sort((a, b) => a.localeCompare(b));
  for (const serviceName of serviceEntries) {
    servicesListHTML +=
      `<li><a href="services/${serviceName}.html">${serviceName}</a></li>`;
  }
  servicesListHTML += `</ul>`;

  // Generate the complete index.html content
  const indexHTMLContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Example of generated images</title>
      <link rel="stylesheet" href="style.css" />
      <link rel="alternate" type="application/rss+xml" title="Examples of generated images" href="rss-feed.xml" />
      <script type="module" src="static/components/netsi-prompt.js"></script>
      <script type="module" src="static/components/netsi-prompts.js"></script>
    </head>
    <body>
      <nav id="main-nav"></nav>
      <main>
        <div id="spa-root">
          <h1>Example of generated images</h1>
          ${promptsListHTML}
          ${servicesListHTML}
          
          <h3>Tools</h3>
          <ul>
          <li><a href="tools/prompt-composition-tool.html">Prompt composition tool</a></li>
          <ul>
        </div>
      </main>

      <!-- SPA Templates -->
      <template id="service-template">
        <div>
          <h1 class="service-title"></h1>
          <p class="service-description"></p>
          <netsi-prompts></netsi-prompts>
        </div>
      </template>

      <template id="tips-template">
        <div>
          <h1>Tips</h1>
          <div class="tips-list"></div>
        </div>
      </template>

      <template id="tools-template">
        <div>
          <h1>Tools</h1>
          <div class="tools-list"></div>
        </div>
      </template>

      <template id="styles-template">
        <div>
          <h1>Styles</h1>
          <p class="disclaimer"></p>
          <netsi-prompts></netsi-prompts>
        </div>
      </template>

      <script type="module" src="static/app.js"></script>
    </body>
  </html>
  `;

  await createTextFile("index.html", indexHTMLContent);
}

// Call the function to generate the index.html file
generateIndexContent();
