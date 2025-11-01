import { analyzeProject } from "../analysis/mod.ts";

async function main() {
  console.log("Starting Project Analysis CLI...");

  try {
    const projectPath = Deno.cwd();
    const analysis = await analyzeProject(projectPath);

    let markdownOutput = `# Project Analysis: ${analysis.purpose}\n\n`;

    markdownOutput += `## Overview\n\n`;
    markdownOutput += `This project is primarily focused on **${analysis.purpose}**. It utilizes a tech stack consisting of **${analysis.techStack.join(", ")}** and is structured around **${analysis.keyComponents.length}** main components.\n\n`;

    markdownOutput += `## Tech Stack\n\n`;
    analysis.techStack.forEach(tech => {
      markdownOutput += `- ${tech}\n`;
    });

    markdownOutput += `\n## Key Components\n\n`;
    analysis.keyComponents.forEach(component => {
      markdownOutput += `- **${component.name}**: ${component.description}\n`;
    });

    const outputPath = `${projectPath}/project-analysis.md`;
    await Deno.writeTextFile(outputPath, markdownOutput);
    console.log(`Analysis complete. Output written to ${outputPath}`);
  } catch (error) {
    console.error(`Error during project analysis: ${error.message}`);
    Deno.exit(1);
  }
}

main();