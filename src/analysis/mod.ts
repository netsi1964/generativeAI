import { ProjectAnalysis } from "./utils.ts";

interface Component {
  name: string;
  description: string;
}

async function traverseDirectory(path: string, components: Component[], techStack: Set<string>): Promise<void> {
  console.log(`Traversing directory: ${path}`);
  for await (const dirEntry of Deno.readDir(path)) {
    const entryPath = `${path}/${dirEntry.name}`;
    if (dirEntry.isFile) {
      const parts = dirEntry.name.split(".");
      if (parts.length > 1) {
        techStack.add(parts[parts.length - 1]);
      }
    } else if (dirEntry.isDirectory) {
      // Identify common component directories
      if (["src", "components", "services", "utils", "cli", "tests"].includes(dirEntry.name)) {
        let description = `Directory for ${dirEntry.name} related code.`;
        // Check for main.ts or mod.ts for more specific description
        try {
          await Deno.stat(`${entryPath}/main.ts`);
          description = `Main entry point for ${dirEntry.name} component.`;
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            try {
              await Deno.stat(`${entryPath}/mod.ts`);
              description = `Module for ${dirEntry.name} component.`;
            } catch (err) {
              if (!(err instanceof Deno.errors.NotFound)) {
                console.error(`Error checking for mod.ts in ${entryPath}: ${err}`);
              }
            }
          } else {
            console.error(`Error checking for main.ts in ${entryPath}: ${error}`);
          }
        }
        components.push({ name: dirEntry.name, description });
        console.log(`Identified component: ${dirEntry.name}`);
      }
      await traverseDirectory(entryPath, components, techStack); // Recursive call
    }
  }
}

async function getProjectPurpose(projectPath: string): Promise<string> {
  const readmePath = `${projectPath}/README.md`;
  try {
    console.log(`Attempting to read README.md at: ${readmePath}`);
    const readmeContent = await Deno.readTextFile(readmePath);
    const firstLine = readmeContent.split('\n')[0];
    if (firstLine.startsWith('#')) {
      console.log(`Purpose extracted from README.md: ${firstLine.substring(1).trim()}`);
      return firstLine.substring(1).trim(); // Remove '#' and trim whitespace
    } else if (firstLine.length > 0) {
      console.log(`Purpose extracted from README.md: ${firstLine.trim()}`);
      return firstLine.trim();
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error(`Error reading README.md: ${error}`);
    } else {
      console.log(`README.md not found at: ${readmePath}`);
    }
  }
  console.log("Using default purpose: A software project with an unknown purpose.");
  return "A software project with an unknown purpose.";
}

export async function analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
  console.log(`Starting analysis for project at: ${projectPath}`);

  const techStack = new Set<string>();
  const keyComponents: Component[] = [];

  await traverseDirectory(projectPath, keyComponents, techStack);

  console.log("Inferring tech stack from file extensions...");
  // Infer languages from file extensions
  if (techStack.has("ts") || techStack.has("tsx")) {
    techStack.add("TypeScript");
  }
  if (techStack.has("js") || techStack.has("jsx")) {
    techStack.add("JavaScript");
  }
  if (techStack.has("json")) {
    techStack.add("JSON");
  }
  if (techStack.has("md")) {
    techStack.add("Markdown");
  }
  if (techStack.has("html")) {
    techStack.add("HTML");
  }
  if (techStack.has("css")) {
    techStack.add("CSS");
  }

  console.log("Checking for framework-specific files...");
  // Infer frameworks/tools from specific files
  try {
    await Deno.stat(`${projectPath}/deno.json`);
    techStack.add("Deno");
    console.log("Deno project detected.");
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error(`Error checking for deno.json: ${error}`);
    } else {
      console.log("deno.json not found.");
    }
  }

  const purpose = await getProjectPurpose(projectPath);

  console.log("Analysis complete.");
  return {
    purpose: purpose,
    techStack: Array.from(techStack),
    keyComponents: keyComponents,
  };
}
