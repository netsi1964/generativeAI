import { walk } from "https://deno.land/std@0.182.0/fs/mod.ts";

const HELP = `
This script generates an RSS feed for the website.

When to use it:
- When you have made changes to the prompt or service files and want to update the RSS feed.

How to use it:
- deno task rss
- deno run --allow-read --allow-write generate-rss.ts

What it does:
- It scans the 'prompts' and 'services' directories for HTML files.
- It gets the last modification date for each file.
- It generates an rss-feed.xml file with an entry for each file, including the title, description, link, and publication date.
`;

if (Deno.args.includes("--help")) {
  console.log(HELP);
  Deno.exit(0);
}

async function getFileUpdatedDate(filePath: string): Promise<Date> {
  const fileInfo = await Deno.stat(filePath);
  return fileInfo.mtime;
}

// Function to generate the RSS feed
async function generateRSSFeed() {
  const feedItems = [];

  // Get prompt files
  for await (const dirEntry of walk("prompts", { exts: [".html"] })) {
    const dateUpdated = await getFileUpdatedDate(dirEntry.path);
    feedItems.push({
      title: `Prompt File: ${dirEntry.name}`,
      description: `Prompt file updated on ${dateUpdated.toISOString()}`,
      link: `https://netsi1964.github.io/generativeAI/prompts/${dirEntry.name}`,
      pubDate: dateUpdated.toUTCString(),
    });
  }

  // Get service files
  for await (const dirEntry of walk("services", { exts: [".html"] })) {
    const dateUpdated = await getFileUpdatedDate(dirEntry.path);
    feedItems.push({
      title: `Service File: ${dirEntry.name}`,
      description: `Service file updated on ${dateUpdated.toISOString()}`,
      link:
        `https://netsi1964.github.io/generativeAI/services/${dirEntry.name}`,
      pubDate: dateUpdated.toUTCString(),
    });
  }

  // Generate the RSS feed XML
  const feedXML = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Examples of generated images</title>
      <description>Compare various genrateiveAI images</description>
      <link>https://netsi1964.github.io/generativeAI/</link>
      ${
    feedItems
      .map(
        (item) => `
        <item>
          <title>${item.title}</title>
          <description>${item.description}</description>
          <link>${item.link}</link>
          <pubDate>${item.pubDate}</pubDate>
        </item>
      `,
      )
      .join("")
  }
    </channel>
  </rss>`;

  // Write the XML to a file
  await Deno.writeTextFile("rss-feed.xml", feedXML);
}

// Generate the RSS feed
generateRSSFeed();
