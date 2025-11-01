const HELP = `
This script runs all the other generation scripts in the correct order to completely rebuild the website.

When to use it:
- When you want to regenerate the entire website after making changes.

How to use it:
- deno task update
- deno run --allow-read --allow-write --allow-run update.ts

What it does:
- It executes the following scripts in order:
  1. generate-prompt-files.ts
  2. generate-services-files.ts
  3. generate-rss.ts
  4. generate-index.ts
`;

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

async function executeDenoScript(scriptPath: string) {
  const process = Deno.run({
    cmd: ["deno", "run", "--allow-read", "--allow-write", scriptPath],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await process.status(); // Wait for the process to exit

  if (code === 0) {
    const output = await process.output(); // Get standard output
    console.log(new TextDecoder().decode(output));
  } else {
    const error = await process.stderrOutput(); // Get standard error
    console.error(`Error in ${scriptPath}: ${new TextDecoder().decode(error)}`);
  }

  process.close(); // Don't forget to close the process
}

// Execute the Deno scripts in sequence
async function main() {
  const scriptPaths = [
    "generate-prompt-files.ts",
    "generate-services-files.ts",
    "generate-rss.ts",
    "generate-index.ts",
  ];

  // Execute the scripts sequentially
  for (const scriptPath of scriptPaths) {
    await executeDenoScript(scriptPath);
  }
}

// Call the main function to start the execution
main();
