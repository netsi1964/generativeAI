// deno run --allow-all generate-prompt-files.ts
import { createTextFile } from "./utils.ts";
import { prompts, KnownServices, services } from "./config.ts";

async function generateHTMLContent(
  promptTitle: string,
  promptText: string,
  files: { service: KnownServices; url: string; comments?: string }[]
) {
  let fileHTML = "";
  files.forEach((file) => {
    fileHTML += `
      <div class="prompt">
        <h2 class="prompt-title">
          <a href="services/${file.service}.html">${file.service}</a>
        </h2>
        <div class="prompt-image">
          <a href="${file.url}" target="_blank"><img src="${
      file.url
    }" alt="${promptTitle}" height="400px" /></a>
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
      prompt.files
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
