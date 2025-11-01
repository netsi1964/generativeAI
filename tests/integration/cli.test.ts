import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";

Deno.test("CLI generates project-analysis.md", async () => {
  const tempDir = await Deno.makeTempDir();
  const originalCwd = Deno.cwd();
  Deno.chdir(tempDir);

  // Create a dummy README.md for purpose detection
  await Deno.writeTextFile("README.md", "# Test Project\nThis is a test project.");
  await Deno.mkdir("src");
  await Deno.writeTextFile("src/main.ts", "console.log('hello');");

  const process = Deno.run({
    cmd: ["deno", "run", "--allow-read", "--allow-write", "--allow-run", "../../src/cli/main.ts"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await process.status();
  const stdout = new TextDecoder().decode(await process.stdout.readAll());
  const stderr = new TextDecoder().decode(await process.stderr.readAll());

  assertEquals(code, 0, `CLI process exited with code ${code}. Stderr: ${stderr}`);
  assertEquals(stdout.includes("Analysis complete. Output written to"), true);

  const outputPath = `${tempDir}/project-analysis.md`;
  const outputContent = await Deno.readTextFile(outputPath);

  assertEquals(outputContent.includes("# Project Analysis: Test Project"), true);
  assertEquals(outputContent.includes("## Overview"), true);
  assertEquals(outputContent.includes("## Tech Stack"), true);
  assertEquals(outputContent.includes("## Key Components"), true);
  assertEquals(outputContent.includes("- TypeScript"), true);
  assertEquals(outputContent.includes("- **src**: Main entry point for src component."), true);

  process.close();
  Deno.chdir(originalCwd);
  await Deno.remove(tempDir, { recursive: true });
});
