import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";
import { analyzeProject } from "../../src/analysis/mod.ts";

Deno.test("analyzeProject identifies Deno and TypeScript", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/mod.ts`, "console.log('hello');");
  await Deno.writeTextFile(`${tempDir}/deno.json`, "{}");

  const analysis = await analyzeProject(tempDir);

  assertEquals(analysis.techStack.includes("Deno"), true);
  assertEquals(analysis.techStack.includes("TypeScript"), true);

  await Deno.remove(tempDir, { recursive: true });
});

Deno.test("analyzeProject identifies HTML and CSS", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/index.html`, "<p>Hello</p>");
  await Deno.writeTextFile(`${tempDir}/style.css`, "body { color: red; }");

  const analysis = await analyzeProject(tempDir);

  assertEquals(analysis.techStack.includes("HTML"), true);
  assertEquals(analysis.techStack.includes("CSS"), true);

  await Deno.remove(tempDir, { recursive: true });
});

Deno.test("analyzeProject extracts purpose from README.md", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.writeTextFile(`${tempDir}/README.md`, "# My Awesome Project\nThis project does amazing things.");

  const analysis = await analyzeProject(tempDir);

  assertEquals(analysis.purpose, "My Awesome Project");

  await Deno.remove(tempDir, { recursive: true });
});

Deno.test("analyzeProject identifies key components", async () => {
  const tempDir = await Deno.makeTempDir();
  await Deno.mkdir(`${tempDir}/src`);
  await Deno.mkdir(`${tempDir}/components`);
  await Deno.writeTextFile(`${tempDir}/src/main.ts`, "");

  const analysis = await analyzeProject(tempDir);

  assertEquals(analysis.keyComponents.some(c => c.name === "src"), true);
  assertEquals(analysis.keyComponents.some(c => c.name === "components"), true);
  assertEquals(analysis.keyComponents.some(c => c.description.includes("Main entry point for src component.")), true);

  await Deno.remove(tempDir, { recursive: true });
});
