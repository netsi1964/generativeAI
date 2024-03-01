// deno run --allow-all create-html.ts
import { prompts, KnownServices, services } from "./config.ts";

// Function to generate HTML content for each service
async function generateServicePage(serviceName: KnownServices) {
  const service = services.find((s) => s.service === serviceName);
  const promptsForService = prompts.filter(
    (prompt) =>
      prompt.files.filter((file) => file.service === serviceName).length > 0
  );

  let imageHTML = "";
  promptsForService.forEach((prompt) => {
    imageHTML += prompt.files
      .filter((file) => file.service === serviceName)
      .map(
        (file) =>
          `
          <div class="prompt">
          <h2 class="prompt-title">${prompt.title}</h2>
          <pre class="prompt-text">${prompt.prompt}</pre>
          ${
            file.comments
              ? `<p class="prompt-comments">${file.comments}</p>`
              : ""
          }
          <h3>Image</h3>
          <div class="prompt-image">
          <img src="${file.url}" alt="${prompt.title}" height="400px" />
          </div>
          <a href="${file.url}" target="_blank">Full size</a>
          </div>
          `
      );
  });
  const servicePageContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${serviceName}</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Service: <a href="${service?.url}">${serviceName}</a></h1>
    <p>Here are some example generated prompts from ${serviceName} service.</p>
    <h2>Prompts</h2>
    ${imageHTML}
    <hr>
    <a href="/">🏠 home</a>
  </body>
  </html>
  `;

  createTextFile(`${serviceName}_service.html`, servicePageContent);
}

// Loop through known services and generate a page for each
Object.values(KnownServices).forEach((service) => {
  generateServicePage(service);
});

async function createTextFile(filePath: string, text: string) {
  try {
    await Deno.writeTextFile(filePath, text);
    console.log(`File created at ${filePath}`);
  } catch (error) {
    console.error("Failed to create file:", error);
  }
}

async function listFilesInServiceFolder(
  serviceName: string
): Promise<string[]> {
  const directoryPath = `./images/${serviceName}`;

  try {
    const entries = [];
    for await (const entry of Deno.readDir(directoryPath)) {
      if (entry.isFile) {
        entries.push(entry.name);
      }
    }
    return entries;
  } catch (error) {
    console.error("Failed to read directory:", error);
    return []; // Return an empty array in case of error
  }
}
