import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const HELP = "\
This script generates images using the Grok-4 image generation API.\
\nWhen to use it:\
- When you want to generate images for the prompts using Grok-4.\
\nHow to use it:\
- deno task grok-images\
- deno task grok-images --model=model-name (to use a different model)\
- deno run --allow-read --allow-write --allow-net --allow-env generate-grok-images.ts\
\nWhat it does:\
- It reads the 'config.ts' file to get all prompts.\
- For each prompt that doesn't have a corresponding image file, it calls the Grok-4 API to generate an image.\
- It saves the generated image to the 'images/grok-4' directory.\
- It skips prompts that already have generated images.\
\nRequirements:\
- A .env file with XAI_API_KEY (your X.AI API key).\
- Valid API credentials from X.AI (https://console.x.ai).\
\nTroubleshooting:\
- If you get a 404 error about the model not existing:\
  1. Check your X.AI team/account settings to see available models\
  2. Use --model=your-model-name to specify a different model name\
  3. Contact X.AI support with your team ID";

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

// Load environment variables from .env file
await load({ export: true });

// Configuration
const API_KEY = Deno.env.get("XAI_API_KEY");
const API_BASE_URL = "https://api.x.ai/v1";
// Model name can be overridden via command line argument: --model=model-name
const MODEL = Deno.args.find((arg) => arg.startsWith("--model="))
  ?.split("=")[1] || "grok-2-image-1212";
const IMAGES_DIR = path.join("images", "grok-4");
const DELAY_BETWEEN_CALLS_MS = 2000; // 2 seconds between API calls

if (!API_KEY) {
  console.error("Error: XAI_API_KEY environment variable is not set.");
  console.error(
    "Please set it in your .env file or environment variables.",
  );
  Deno.exit(1);
}

console.log(`Using model: ${MODEL}`);
console.log(`Using API base URL: ${API_BASE_URL}\n`);

// Ensure the output directory exists
await ensureDir(IMAGES_DIR);

/**
 * A simple sleep utility to pause execution.
 * @param ms - The number of milliseconds to wait.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sanitizes a filename by replacing special characters
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100); // Increased from 50 to 100 to preserve more of the filename
}

/**
 * Generate an image using Grok-4 API
 */
async function generateImage(
  prompt: string,
  filename: string,
): Promise<boolean> {
  try {
    console.log(`Generating image for: ${filename}`);

    const response = await fetch(`${API_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        response_format: "b64_json",
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `API Error (${response.status}): ${JSON.stringify(errorData)}`,
      );
      if (response.status === 404) {
        console.error(
          `\nThe model "${MODEL}" was not found or your team doesn't have access to it.`,
        );
        console.error(`Try using a different model with: --model=model-name`);
        console.error(
          `Contact X.AI support if you need help with your team ID: ${errorData?.error || "unknown"}`,
        );
      }
      return false;
    }

    const data = await response.json();

    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      console.error("Invalid response format from API");
      return false;
    }

    // Decode base64 and save as PNG
    const imageData = Uint8Array.from(
      atob(data.data[0].b64_json),
      (c) => c.charCodeAt(0),
    );
    const outputPath = path.join(IMAGES_DIR, `${filename}.png`);

    await Deno.writeFile(outputPath, imageData);
    console.log(`✓ Saved: ${outputPath}`);

    return true;
  } catch (error) {
    console.error(`Error generating image: ${error.message}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("Grok-4 Image Generation Script");
  console.log("================================\n");

  // Import the config
  const { prompts } = await import("./config.ts");

  let successCount = 0;
  let failureCount = 0;

  for (const prompt of prompts) {
    const sanitizedTitle = sanitizeFilename(prompt.title);

    // Check if image already exists
    const outputPath = path.join(IMAGES_DIR, `${sanitizedTitle}.png`);
    try {
      await Deno.stat(outputPath);
      console.log(`⊘ Skipping: ${sanitizedTitle} (already exists)`);
      continue;
    } catch {
      // File doesn't exist, proceed with generation
    }

    const success = await generateImage(prompt.prompt, sanitizedTitle);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }

    // Rate limiting
    await sleep(DELAY_BETWEEN_CALLS_MS);
  }

  console.log("\n================================");
  console.log(`Generation complete!`);
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Failed: ${failureCount}`);
}

main().catch(console.error);
