import { createTextFile } from "./utils.ts";
import { KnownServices, prompts, services } from "./config.ts";

const HELP = `
This script generates individual HTML pages for each prompt defined in config.ts.

When to use it:
- When you have added, removed, or updated prompts in the 'prompts' array in config.ts.

How to use it:
- deno task prompts
- deno run --allow-read --allow-write generate-prompt-files.ts

What it does:
- It iterates over the 'prompts' array in config.ts.
- For each prompt, it generates an HTML file containing the prompt title, text, and associated images.
- It also creates an index.html file in the 'prompts' directory that links to all the generated prompt pages.
`;

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

async function generateHTMLContent(
  promptTitle: string,
  promptText: string,
  files: { service: KnownServices; url: string; comments?: string }[],
) {
  let fileHTML = "";
  files.forEach((file) => {
    fileHTML += `
      <div class="prompt">
        <h2 class="prompt-title">
          <a href="../services/${file.service}.html">${file.service}</a>
        </h2>
        <div class="prompt-image">
          <a href="${file.url}" target="_blank"><img src="${file.url}" alt="${promptTitle}" height="400px" /></a>
        </div>
        ${
      file.comments ? `<p class="prompt-comments">${file.comments}</p>` : ""
    }
      </div>
      `;
  });

  const content = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Prompt: ${promptTitle}</title>
      <link rel="stylesheet" href="../style.css" />
    </head>
    <body>
      <h2>
        <a href="/generativeAI">🏠 home</a> &gt;
        <a href="index.html">Generated images</a>
      </h2>
      <h2 class="prompt-title">${promptTitle}</h2>
      <pre class="prompt-text">${promptText}</pre>
      <div class="prompts">
        ${fileHTML}
      </div>
      <hr />
      <a href="/generativeAI">🏠 home</a>
    </body>
  </html>
  `;

  const fileName = `${promptTitle}.html`;
  const filePath = `prompts/${fileName}`;

  await createTextFile(filePath, content);
  return fileName;
}

async function processPrompts() {
  const promises = prompts.map(async (prompt) => {
    const filename = await generateHTMLContent(
      prompt.title,
      prompt.prompt,
      prompt.files,
    );
    return filename;
  });

  const generatedFilenames = await Promise.all(promises);
  return generatedFilenames;
}

async function createIndexPage(filenames: string[]) {
  let indexHTML = `
  <!DOCTYPE html>
    <html>
      <head>
        <title>Generated images</title>
        <link rel="stylesheet" href="../style.css">
      </head>
      <body>
        <h1>Generated images</h1>
        <ul>
  `;

  filenames.forEach((filename) => {
    indexHTML += `<li><a href="${filename}">${
      filename.split(".html")[0]
    }</a></li>`;
  });

  indexHTML += `
        </ul>
        <h2><a href="tips.html">Some shared prompt techniques</a></h2>
        <hr>
        <a href="/generativeAI">🏠 home</a>
      </body>
    </html>
  `;

  await createTextFile("prompts/index.html", indexHTML);
}

async function main() {
  const generatedFilenames = await processPrompts();
  await createIndexPage(generatedFilenames);
}

main();
