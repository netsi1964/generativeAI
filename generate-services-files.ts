// deno run --allow-all generate-services-files.ts
import { prompts, KnownServices, services } from "./config.ts";
import { createTextFile, getTips } from "./utils.ts";

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
          <div class="prompt-image">
          <a href="${file.url}" target="_blank"><img src="${file.url}" alt="${
            prompt.title
          }" height="400px" /></a>
          </div>
          </div>
          `
      )
      .join("");
  });
  const servicePageContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${serviceName}</title>
    <link rel="stylesheet" href="../style.css">
  </head>
  <body>
    <h2><a href="/generativeAI">🏠 home</a> &gt; <a href="index.html">Services</a> &gt; <a href="${
      service?.url
    }">${serviceName}</a>🔗</h2>
    ${await getTips(serviceName)}
    <p>Here are some example generated prompts from ${serviceName} service.</p>
    ${
      service?.comments
        ? `<blockquote class="service-comment">${service?.comments}</blockquote>`
        : ""
    }
    <div class="prompts">
    ${imageHTML}
    </div>
    <hr>
    <a href="/generativeAI">🏠 home</a> - <a href="index.html">Services</a>
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
    <a href="/generativeAI">🏠 home</a>
      </body>
      </html>
    `;
  await createTextFile("services/index.html", indexHTML);
});
