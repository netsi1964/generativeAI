async function executeDenoScript(scriptPath: string) {
  const cmd = ["deno", "run", "--allow-read", "--allow-write", scriptPath];
  const process = Deno.run({
    cmd: cmd,
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

async function main() {
  await executeDenoScript("generate-prompt-files.ts");
  await executeDenoScript("generate-services-files.ts");
  await executeDenoScript("generate-rss.ts");
  await executeDenoScript("generate-index.ts");
}

main();
