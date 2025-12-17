import { prompts } from "../config.ts";

const PLACEHOLDER_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAADUlEQVQImWP4////fwAJAgP1tN4b0wAAAABJRU5ErkJggg==";
const PLACEHOLDER_IMAGE_BYTES = Uint8Array.from(
  atob(PLACEHOLDER_IMAGE_BASE64),
  (chr) => chr.charCodeAt(0),
);

/**
 * Adds a new service entry across config, navigation, and supporting directories.
 */

type FlagValue = string | undefined;

function parseFlag(flag: string): FlagValue {
  const arg = Deno.args.find((value) => value.startsWith(`${flag}=`));
  if (!arg) return undefined;
  return arg.slice(flag.length + 1);
}

function toEnumKey(name: string): string {
  const normalized = name.replace(/[^A-Za-z0-9]+/g, "_").replace(
    /^_+|_+$/g,
    "",
  );
  if (!normalized) {
    throw new Error("Unable to derive enum key from service name.");
  }
  const upper = normalized.toUpperCase();
  if (/^\d/.test(upper)) {
    return `SERVICE_${upper}`;
  }
  return upper;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function derivePlaceholderName(
  promptTitle: string,
  sampleFile?: string,
): string {
  if (sampleFile) {
    const fileName = sampleFile.split("/").pop() ?? sampleFile;
    const base = fileName.replace(/\.[^.]+$/, "");
    if (base.length > 0) {
      return `${base}.png`;
    }
  }
  return `${slugify(promptTitle)}.png`;
}

function findClosingBracket(text: string, startIndex: number): number {
  let depth = 0;
  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];
    if (char === "[") {
      depth++;
    } else if (char === "]") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  throw new Error("Unable to find matching closing bracket.");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addServiceFileEntryToPrompt(
  text: string,
  promptTitle: string,
  entryText: string,
  enumKey: string,
  startIndex: number,
): { text: string; changed: boolean; nextSearchStart: number } {
  const titleString = JSON.stringify(promptTitle);
  const regex = new RegExp(`title:\\s*${escapeRegExp(titleString)}`, "g");
  regex.lastIndex = startIndex;
  const match = regex.exec(text);
  if (!match) {
    throw new Error(`Could not find prompt entry for "${promptTitle}"`);
  }
  const titleIndex = match.index;

  const filesIndex = text.indexOf("files: [", titleIndex);
  if (filesIndex === -1) {
    throw new Error(`Could not find files array for prompt "${promptTitle}"`);
  }

  const bracketStart = text.indexOf("[", filesIndex);
  if (bracketStart === -1) {
    throw new Error(
      `Could not locate start of files array for "${promptTitle}"`,
    );
  }

  const bracketEnd = findClosingBracket(text, bracketStart);
  const filesBlock = text.slice(filesIndex, bracketEnd + 1);
  if (filesBlock.includes(`service: KnownServices.${enumKey}`)) {
    return { text, changed: false, nextSearchStart: bracketEnd + 1 };
  }

  const updatedText = text.slice(0, bracketEnd) + entryText +
    text.slice(bracketEnd);
  return {
    text: updatedText,
    changed: true,
    nextSearchStart: bracketEnd + entryText.length + 1,
  };
}

async function ensureExists(path: string, content?: Uint8Array | string) {
  try {
    await Deno.stat(path);
    return false;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
  if (typeof content === "string") {
    await Deno.writeTextFile(path, content);
  } else if (content instanceof Uint8Array) {
    await Deno.writeFile(path, content);
  } else {
    await Deno.writeTextFile(path, "");
  }
  return true;
}

async function main() {
  const name = parseFlag("--name");
  if (!name) {
    console.error("Missing required flag: --name");
    Deno.exit(1);
  }
  const displayName = parseFlag("--display") ?? name;
  const url = parseFlag("--url") ?? `https://${name}`;
  const comments = parseFlag("--comments");

  const enumKey = toEnumKey(name);

  const configPath = "config.ts";
  let updatedConfig = await Deno.readTextFile(configPath);
  const serviceExists = updatedConfig.includes(
    `"${enumKey}" = "${name}"`,
  );

  if (!serviceExists) {
    const enumMarker = "\n}\n\nexport const services";
    const enumInsert = updatedConfig.indexOf(enumMarker);
    if (enumInsert === -1) {
      throw new Error(
        "Unable to locate KnownServices enum closing in config.ts",
      );
    }

    const enumEntry = `  "${enumKey}" = "${name}",\n`;
    updatedConfig = updatedConfig.slice(0, enumInsert) + enumEntry +
      updatedConfig.slice(enumInsert);

    const servicesMarker = "\n];";
    const servicesStart = updatedConfig.indexOf("export const services");
    if (servicesStart === -1) {
      throw new Error("Unable to locate services array in config.ts");
    }
    const servicesEnd = updatedConfig.indexOf(servicesMarker, servicesStart);
    if (servicesEnd === -1) {
      throw new Error("Unable to locate end of services array in config.ts");
    }

    const commentsEntry = comments
      ? `    comments: ${JSON.stringify(comments)},\n`
      : "";
    const serviceEntry =
      `  {\n    service: KnownServices.${enumKey},\n    url: ${
        JSON.stringify(url)
      },\n${commentsEntry}  },\n`;
    updatedConfig = updatedConfig.slice(0, servicesEnd) + serviceEntry +
      updatedConfig.slice(servicesEnd);
    console.log(`Added ${name} to config.ts`);
  } else {
    console.log(`${name} already exists in config.ts`);
  }

  const placeholderNames = new Map<string, string>();
  for (const prompt of prompts) {
    const sampleFile = prompt.files[0]?.url;
    const placeholderName = derivePlaceholderName(prompt.title, sampleFile);
    placeholderNames.set(prompt.title, placeholderName);
  }

  const imagesDir = `images/${name}`;
  await Deno.mkdir(imagesDir, { recursive: true });
  console.log(`Ensured ${imagesDir} exists`);

  for (const [promptTitle, placeholderName] of placeholderNames) {
    const placeholderPath = `${imagesDir}/${placeholderName}`;
    if (await ensureExists(placeholderPath, PLACEHOLDER_IMAGE_BYTES)) {
      console.log(`Created placeholder image ${placeholderPath}`);
    }
  }

  let promptsChanged = false;
  let searchStart = 0;
  for (const prompt of prompts) {
    const placeholderName = placeholderNames.get(prompt.title);
    if (!placeholderName) continue;
    const entry =
      `      {\n        service: KnownServices.${enumKey},\n        url: "../images/${name}/${placeholderName}",\n        comments: "Placeholder for ${displayName} output."\n      },\n`;
    const result = addServiceFileEntryToPrompt(
      updatedConfig,
      prompt.title,
      entry,
      enumKey,
      searchStart,
    );
    if (result.changed) {
      updatedConfig = result.text;
      promptsChanged = true;
    }
    searchStart = result.nextSearchStart;
  }

  if (promptsChanged) {
    console.log("Updated prompt entries with placeholder files.");
  } else {
    console.log("Prompt entries already include this service.");
  }

  await Deno.writeTextFile(configPath, updatedConfig);

  const staticDir = `static/${name}`;
  await Deno.mkdir(staticDir, { recursive: true });
  const tipsPath = `${staticDir}/tips.html`;
  if (
    await ensureExists(
      tipsPath,
      `<p>No tips yet for ${displayName}. Add information in ${staticDir}/tips.html.</p>\n`,
    )
  ) {
    console.log(`Created ${tipsPath}`);
  }

  const navPath = "static/components/netsi-navigation.js";
  let navText = await Deno.readTextFile(navPath);
  const serviceLink = `#/service/${name}`;
  if (!navText.includes(serviceLink)) {
    const servicesBlockStart = navText.indexOf(
      '<a href="javascript:void(0)">Services ▼</a>',
    );
    if (servicesBlockStart === -1) {
      throw new Error("Unable to find Services dropdown in navigation.");
    }
    const insertPoint = navText.indexOf("</ul>", servicesBlockStart);
    if (insertPoint === -1) {
      throw new Error("Unable to find closing </ul> for Services dropdown.");
    }
    const entry =
      `              <li><a href="\${spaPrefix}#/service/${name}">${displayName}</a></li>\n`;
    navText = navText.slice(0, insertPoint) + entry +
      navText.slice(insertPoint);
    await Deno.writeTextFile(navPath, navText);
    console.log(`Updated ${navPath} with ${name}`);
  } else {
    console.log(`${name} already present in ${navPath}`);
  }
}

await main();
