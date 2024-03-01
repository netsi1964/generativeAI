// deno run --allow-all create-html.ts
import { prompts, KnownServices, services } from "./config.ts";

// Function to generate HTML content for each service
async function generateServicePage(
  serviceName: KnownServices
): Promise<string> {
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
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <h1>Service: <a href="${service?.url}">${serviceName}</a></h1>
    <p>Here are some example generated prompts from ${serviceName} service.</p>
    ${
      service?.comments
        ? `<blockquote class="service-comment">${service?.comments}</blockquote>`
        : ""
    }
    <h2>Prompts</h2>
    ${imageHTML}
    <hr>
    <a href="/">🏠 home</a>
  </body>
  </html>
  `;

  const fileName = `${serviceName}.html`;
  const serviceFile = `services/${fileName}`;
  await createTextFile(serviceFile, servicePageContent);
  return fileName;
}

let indexHTML = `
<!DOCTYPE html>
  <html>
  <head>
    <title>GenerativeAI Services</title>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <h1>Services</h1>
    <ul>`;

async function processServices() {
  const promises = Object.values(KnownServices).map(async (service) => {
    const filename = await generateServicePage(service);
    return `<li><a href="${filename}">${service}</a></li>`;
  });

  // Wait for all promises to resolve
  const listItems = await Promise.all(promises);
  // Concatenate all generated list items into `indexHTML`
  indexHTML += listItems.join("");
}

// Call the async function
processServices().then(async () => {
  indexHTML += `</ul>
    <hr>
        <a href="/">🏠 home</a>
      </body>
      </html>
    `;
  await createTextFile("services/index.html", indexHTML);
});

async function createTextFile(filePath: string, text: string) {
  try {
    try {
      await Deno.remove(filePath);
    } catch (error) {
      console.error("Failed to remove file:", error);
    }
    await Deno.writeTextFile(filePath, text, { create: true });
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
