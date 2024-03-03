// deno run --allow-read --allow-write generate-index.ts
import { walk } from "https://deno.land/std/fs/mod.ts";
import { createTextFile } from "./utils.ts";

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
    promptsListHTML += `<li><a href="prompts/${promptName}.html">${promptName}</a></li>`;
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
    servicesListHTML += `<li><a href="services/${serviceName}.html">${serviceName}</a></li>`;
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
    </head>
    <body>
      <h1>Example of generated images</h1>
      ${promptsListHTML}
      ${servicesListHTML}
    </body>
  </html>
  `;

  await createTextFile("index.html", indexHTMLContent);
}

// Call the function to generate the index.html file
generateIndexContent();
