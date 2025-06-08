// Kør denne fil med: node scripts/generate-prompts-properties.js
import fs from 'fs';
import path from 'path';

const contentPath = './static/data/content.json';
const imagesRoot = './images';

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

function getPromptVariants(service, prompts) {
  const folder = service.imageFolder.replace(/^\.\.\/images\//, '');
  const dir = path.join(imagesRoot, folder);
  let promptIds = [];

  prompts.forEach(prompt => {
    let found = null;
    let foundExt = null;
    try {
      const files = fs.readdirSync(dir);
      // Find alle filer der matcher prompt.filename (uden extension, case-insensitive)
      const base = prompt.filename.replace(/\.[^.]+$/, '').toLowerCase();
      const matches = files.filter(f =>
        f.toLowerCase().replace(/\.[^.]+$/, '') === base
      );
      if (matches.length > 0) {
        // Brug faktisk extension
        found = matches[0];
        foundExt = path.extname(found).slice(1); // uden punktum
      }
    } catch (e) {
      // ignore
    }
    if (found && foundExt) {
      // Hvis extension matcher prompt.filename, brug bare id, ellers brug id.ext
      const origExt = path.extname(prompt.filename).slice(1);
      if (foundExt === origExt) {
        promptIds.push(prompt.id);
      } else {
        promptIds.push(`${prompt.id}.${foundExt}`);
      }
    } else {
      // Hvis ikke fundet, brug default id
      promptIds.push(prompt.id);
    }
  });

  return promptIds;
}

console.log('// Kopiér og indsæt disse "prompts" arrays i din content.json for hver service:\n');
content.services.forEach(service => {
  const promptIds = getPromptVariants(service, content.prompts);
  console.log(`// ${service.name}`);
  console.log(`"prompts": [${promptIds.map(id => `"${id}"`).join(', ')}],\n`);
});
