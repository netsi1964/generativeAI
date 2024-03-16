import { KnownServices } from "./config.ts";

export async function createTextFile(filePath: string, text: string) {
  try {
    try {
      await Deno.remove(filePath);
    } catch (error) {
      console.info("Failed to remove file:", error);
    }
    await Deno.writeTextFile(filePath, text, { create: true });
    console.log(`File created at ${filePath}`);
  } catch (error) {
    console.error("Failed to create file:", error);
  }
}

export async function listFilesInServiceFolder(
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

export async function getTips(serviceName: KnownServices) {
  let tips = "";
  const imageFile = `static/${serviceName}/tips.html`;

  try {
    const stat = await Deno.stat(imageFile);
    if (stat.isFile) {
      tips = await Deno.readTextFile(imageFile);
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // The file doesn't exist
      console.log("File not found:", imageFile);
    } else {
      // Some other error occurred
      throw error;
    }
  }
  tips = tips !== "" ? `<h3>Tips</h3>${tips}` : "";
  console.log(tips);
  return tips;
}
