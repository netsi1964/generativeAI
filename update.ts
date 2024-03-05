// Function to execute the Deno script
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
