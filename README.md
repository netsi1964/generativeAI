# generativeAI

A statically generated gallery that compares prompts and outputs from multiple image generation services and large language model (LLM) backends. Explore it live at [https://netsi1964.github.io/generativeAI](https://netsi1964.github.io/generativeAI).

## How it works

- **Data-driven content** – Prompt definitions, service metadata, and image paths live in `config.ts`; additional Imagen/Vertex styles are tracked in `static/data/content.json`.
- **Code generation scripts** – `deno.json` exposes tasks that regenerate the site without manual editing. Each script prints inline help via `--help`.
- **Static hosting** – Generated HTML, CSS, and RSS files sit in the repo root so GitHub Pages can publish them automatically.

### Prompt & service pages

1. Define prompts and their associated service outputs in `config.ts`.
2. Run `deno task prompts` to rebuild `prompts/*.html` (one page per prompt with thumbnails that deep-link to the raw images under `images/<service>/`).
3. Run `deno task services` to rebuild `services/*.html`, which aggregate all prompt runs for a single provider and optionally inject service-specific tips loaded from `static/<service>/tips.html`.
4. After any additions, run `deno task index` and `deno task rss` to refresh the site landing page (`index.html`) and RSS feed (`rss-feed.xml`) so navigation and syndication stay current.

### Imagen/Vertex AI workflow

The `static/data/content.json` file tracks Imagen styles, prompts, and folders for each provider. The `generate_images.ts` script:

- Reads the styles section from the JSON file.
- Fetches new outputs from Google Vertex AI’s Imagen model (requires `GCP_PROJECT_ID`, `GCP_LOCATION`, and credentials in the environment).
- Saves binary assets into `images/styles/` and updates metadata such as `generated` timestamps and token usage counts.

To normalize filenames after syncing new assets, run `node scripts/cat-image-filenames.js` and execute the suggested `mv` commands.

### Repo layout quick reference

- `images/` – Raw outputs grouped per provider; HTML files reference these paths directly.
- `prompts/` & `services/` – Generated site sections.
- `static/` – Shared assets and provider-specific tips.
- `src/` & `tests/` – CLI tooling for deeper project analysis (see `project-analysis.md`).

## Development workflow

1. Install the latest [Deno](https://deno.land/manual/getting_started/installation).
2. Clone the repository and run `deno task help` to see available generators.
3. Update prompts/services/Imagen styles as needed.
4. Run the relevant Deno tasks (`prompts`, `services`, `index`, `rss`, `images`) and commit the regenerated HTML/JSON/assets.

## Plan for future enhancements

1. **Add more curated prompts and outputs**
   - Draft new prompt specs directly in `config.ts`, collect outputs from existing providers, and drop them into the matching `images/<service>/` folders.
   - Re-run `deno task prompts`, `deno task services`, and `deno task index` to publish the new comparisons.
2. **Onboard additional LLM/image services**
   - Extend `KnownServices` in `config.ts`, add the service metadata (URL, comments, tips), and create a folder under `images/<serviceId>/`.
   - Populate `static/<serviceId>/tips.html` with provider-specific guidance so generated service pages immediately surface best practices.
3. **Grow the Imagen style library**
   - Append new entries to `static/data/content.json` with style IDs, prompts, and desired output filenames.
   - Use `deno task images` to call Vertex AI, then `node scripts/cat-image-filenames.js` to align filenames prior to publishing.
4. **Storytell updates via changelog/RSS**
   - Each time you add prompts or providers, refresh `rss-feed.xml` (`deno task rss`) and consider updating `project-analysis.md` to capture lessons learned for future contributors.

This roadmap keeps both the data model and the automation scripts in sync, making it easy to scale the gallery with richer prompts and a broader set of generative LLMs.
