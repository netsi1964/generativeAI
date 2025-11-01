import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";
import { decodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const HELP = "\
This script generates images using the Vertex AI Imagen model.\
\nWhen to use it:\
- When you want to generate images for the styles defined in static/data/content.json.\
\nHow to use it:\
- deno task images\
- deno run --allow-read --allow-write --allow-net --allow-env --allow-run generate_images.ts\
\nWhat it does:\
- It reads the 'static/data/content.json' file.\
- For each style that has not been generated yet, it calls the Vertex AI Imagen API to generate an image.\
- It saves the generated image to the 'images/styles' directory.\
- It updates the 'generated' and 'tokensUsed' fields in the content.json file.\
\nRequirements:\
- A .env file with GCP_PROJECT_ID and GCP_LOCATION.\
- You must be authenticated with gcloud CLI.";

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

// Using gcloud CLI for authentication instead of google-auth-library

// --- Configuration ---

// Load environment variables from .env file
await load({ export: true });

// File system paths
const CONTENT_PATH = path.join("static", "data", "content.json");
const IMAGES_DIR = path.join("images", "styles");

// AI Generation settings
const GCP_PROJECT_ID = Deno.env.get("GCP_PROJECT_ID");
const GCP_LOCATION = Deno.env.get("GCP_LOCATION");
const GOOGLE_APPLICATION_CREDENTIALS = Deno.env.get(
  "GOOGLE_APPLICATION_CREDENTIALS",
);
// As requested, using the preview model for Imagen.
// This may change; refer to Google Cloud documentation for the latest models.
const IMAGE_MODEL = "imagen-4.0-generate-preview-06-06";
const IMAGE_EXTENSION = "jpg"; // Use 'png' if you change the output format
const IMAGE_OUTPUT_FORMAT = "jpeg"; // Use 'png' for PNG format

// Rate-limiting delay to avoid overwhelming the API
const DELAY_BETWEEN_CALLS_MS = 5000; // 5 seconds

// --- Type Definitions ---
interface Style {
  id: string;
  style: string;
  stylePrompt: string;
  generated?: string;
  tokensUsed?: number | null;
  [key: string]: any;
}

interface ContentFile {
  styles: Style[];
}

/**
 * A simple sleep utility to pause execution.
 * @param ms - The number of milliseconds to wait.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detects image file type from binary data by reading magic bytes
 * @param imageData - The binary image data
 * @returns The detected file extension or 'jpg' as fallback
 */
function detectImageType(imageData: Uint8Array): string {
  // Check for PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    imageData.length >= 8 &&
    imageData[0] === 0x89 && imageData[1] === 0x50 &&
    imageData[2] === 0x4E && imageData[3] === 0x47 &&
    imageData[4] === 0x0D && imageData[5] === 0x0A &&
    imageData[6] === 0x1A && imageData[7] === 0x0A
  ) {
    return "png";
  }

  // Check for JPEG: FF D8 FF
  if (
    imageData.length >= 3 &&
    imageData[0] === 0xFF && imageData[1] === 0xD8 && imageData[2] === 0xFF
  ) {
    return "jpg";
  }

  // Check for WebP: "WEBP" in header (after RIFF)
  if (imageData.length >= 12) {
    const webpCheck = new TextDecoder().decode(imageData.slice(8, 12));
    if (webpCheck === "WEBP") {
      return "webp";
    }
  }

  // Check for GIF: "GIF87a" or "GIF89a"
  if (imageData.length >= 6) {
    const gifCheck = new TextDecoder().decode(imageData.slice(0, 6));
    if (gifCheck === "GIF87a" || gifCheck === "GIF89a") {
      return "gif";
    }
  }

  // Default fallback
  return "jpg";
}

/**
 * Finds the gcloud command in common locations
 * @returns The path to gcloud or null if not found
 */
async function findGcloudPath(): Promise<string | null> {
  const possiblePaths = [
    "gcloud", // Try PATH first
    "/usr/local/bin/gcloud",
    "/usr/bin/gcloud",
    "/Users/stenhougaard/google-cloud-sdk/bin/gcloud",
    "/opt/homebrew/bin/gcloud",
    "/usr/local/google-cloud-sdk/bin/gcloud",
  ];

  for (const path of possiblePaths) {
    try {
      const command = new Deno.Command(path, {
        args: ["--version"],
        stdout: "piped",
        stderr: "piped",
      });

      const { code } = await command.output();
      if (code === 0) {
        return path;
      }
    } catch {
      // Continue to next path
    }
  }

  return null;
}

/**
 * Gets an access token using gcloud CLI
 * @returns A promise that resolves to the access token
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const gcloudPath = await findGcloudPath();

    if (!gcloudPath) {
      console.error(
        "  - ❌ Error: gcloud command not found. Please install Google Cloud SDK.",
      );
      return null;
    }

    const command = new Deno.Command(gcloudPath, {
      args: ["auth", "print-access-token"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await command.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      console.error(`  - ❌ Error getting access token: ${errorText}`);
      return null;
    }

    const token = new TextDecoder().decode(stdout).trim();
    return token;
  } catch (error) {
    console.error(`  - ❌ Error executing gcloud command:`, error);
    return null;
  }
}

/**
 * Generates an image using Vertex AI's Imagen model via REST API.
 * @param prompt - The text prompt for image generation.
 * @param projectId - The Google Cloud project ID.
 * @param location - The Google Cloud location.
 * @returns A promise that resolves to the image data and usage metadata.
 */
async function generateImage(
  prompt: string,
  projectId: string,
  location: string,
): Promise<{ imageData: Uint8Array; usage: number | null } | null> {
  console.log("  - Sending prompt to AI...");
  try {
    // Get access token using gcloud CLI
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.error("  - ❌ Error: Could not obtain access token.");
      return null;
    }

    // Construct the API endpoint
    const apiEndpoint =
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${IMAGE_MODEL}:predict`;

    // Prepare the request payload
    const requestBody = {
      instances: [
        {
          prompt: prompt,
          sampleCount: 1,
          aspectRatio: "1:1",
          outputFileFormat: IMAGE_OUTPUT_FORMAT,
        },
      ],
    };

    console.log("  - Calling Vertex AI Imagen API...");
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `  - ❌ API Error: ${response.status} ${response.statusText}`,
      );
      console.error(`  - ❌ Error details: ${errorText}`);
      return null;
    }

    const responseData = await response.json();

    if (!responseData.predictions || responseData.predictions.length === 0) {
      console.error("  - ❌ Error: AI response did not contain predictions.");
      return null;
    }

    const prediction = responseData.predictions[0];
    const base64Data = prediction.bytesBase64Encoded;

    if (!base64Data || typeof base64Data !== "string") {
      console.error(
        "  - ❌ Error: Prediction did not contain valid base64 image data.",
      );
      return null;
    }

    const imageData = decodeBase64(base64Data);

    // Extract usage metadata if available
    const usage = responseData.metadata?.totalBilledCharacters ?? null;

    console.log(`  - ✅ AI response received. Usage: ${usage ?? "N/A"}`);
    return { imageData, usage };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  - ❌ Error during AI image generation:`, errorMessage);
    return null;
  }
}

/**
 * Main execution function.
 */
async function main() {
  console.log("--- Starting Image Generation Script ---");

  // 1. Validate environment configuration
  if (!GCP_PROJECT_ID || !GCP_LOCATION) {
    console.error(
      "❌ Fatal: GCP_PROJECT_ID and GCP_LOCATION must be set in your .env file or environment.",
    );
    return;
  }
  console.log(`- Using Project: ${GCP_PROJECT_ID}, Location: ${GCP_LOCATION}`);

  // 2. Ensure output directory exists
  await ensureDir(IMAGES_DIR);
  console.log(`- Image output directory is ready at: ${IMAGES_DIR}`);

  // 3. Read the content data
  let content: ContentFile;
  try {
    const fileContent = await Deno.readTextFile(CONTENT_PATH);
    content = JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Fatal: Could not read or parse ${CONTENT_PATH}.`, error);
    return;
  }
  console.log(`- Loaded ${content.styles.length} styles from ${CONTENT_PATH}.`);

  // 4. Sequentially process each style
  for (const style of content.styles) {
    console.log(`\nProcessing style: "${style.style}" (ID: ${style.id})`);

    // Check if already generated and file exists (check all common image formats)
    const possibleExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    let fileExists = false;
    let existingFilePath = "";

    for (const ext of possibleExtensions) {
      const fileName = `${style.id}.${ext}`;
      const filePath = path.join(IMAGES_DIR, fileName);

      try {
        await Deno.stat(filePath);
        fileExists = true;
        existingFilePath = filePath;
        break; // Found a file, stop searching
      } catch {
        // Continue to next extension
      }
    }

    // Skip if already generated AND file exists
    if (style.generated && fileExists) {
      const foundFileName = path.basename(existingFilePath);
      console.log(
        `  - ⏩ Skipping, already generated on: ${style.generated} (file exists: ${foundFileName})`,
      );
      continue;
    }

    // If generated flag is set but file doesn't exist, reset the flag
    if (style.generated && !fileExists) {
      console.log(
        `  - ⚠️ Generated flag set but file missing, regenerating...`,
      );
      style.generated = undefined;
      style.tokensUsed = undefined;
    }

    // Generate the image
    const generationResult = await generateImage(
      style.stylePrompt,
      GCP_PROJECT_ID!,
      GCP_LOCATION!,
    );

    if (generationResult) {
      const { imageData, usage } = generationResult;

      // Detect the actual image type from the data
      const detectedExtension = detectImageType(imageData);
      const fileName = `${style.id}.${detectedExtension}`;
      const filePath = path.join(IMAGES_DIR, fileName);

      try {
        await Deno.writeFile(filePath, imageData);
        console.log(
          `  - 💾 Image saved successfully to: ${filePath} (detected format: ${detectedExtension})`,
        );

        // Update the style object in memory
        style.generated = new Date().toISOString();
        style.tokensUsed = usage; // Store usage data

        // Write the updated content back to the JSON file
        await Deno.writeTextFile(
          CONTENT_PATH,
          JSON.stringify(content, null, 2),
        );
        console.log(`  - 📝 Updated ${CONTENT_PATH} with generation status.`);
      } catch (error) {
        console.error(
          `  - ❌ Error saving image or updating JSON for ${style.id}:`,
          error,
        );
      }
    } else {
      console.log(
        `  - ⚠️ Failed to generate image for ${style.id}. Moving to next.`,
      );
    }

    // Wait before the next API call
    console.log(
      `  - ⏳ Waiting for ${DELAY_BETWEEN_CALLS_MS / 1000} seconds...`,
    );
    await sleep(DELAY_BETWEEN_CALLS_MS);
  }

  console.log("\n--- Script finished. All styles processed. ---");
}

// Run the main function
main().catch((error) => {
  console.error("An unexpected error occurred:", error);
});
