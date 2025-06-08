// Kør denne fil med: node scripts/cat-image-filenames.js
import fs from 'fs';
import path from 'path';

const contentPath = './static/data/content.json';
const imagesRoot = './images';

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

let renameCommands = [];

content.services.forEach(service => {
  const folder = service.imageFolder.replace(/^\.\.\/images\//, '');
  const dir = path.join(imagesRoot, folder);

  service.prompts.forEach(pid => {
    const [promptId, ext] = pid.split('.');
    const prompt = content.prompts.find(p => p.id === promptId);
    if (!prompt) return;

    // Det filnavn ALLE skal bruge:
    let targetFilename = prompt.filename;

    // Find faktisk filnavn i mappen (case-insensitive, uanset extension)
    try {
      const files = fs.readdirSync(dir);
      // Find fil der matcher promptId (uden extension)
      const found = files.find(f =>
        f.toLowerCase().replace(/\.[^.]+$/, '') === targetFilename.toLowerCase().replace(/\.[^.]+$/, '')
      );
      if (found && found !== targetFilename) {
        // Generer mv kommando
        renameCommands.push(`mv "${dir}/${found}" "${dir}/${targetFilename}"`);
      }
      // Hvis der er extension override i service.prompts, find filen med den extension og omdøb til targetFilename
      if (ext) {
        const overrideName = targetFilename.replace(/\.[^.]+$/, '.' + ext);
        if (fs.existsSync(path.join(dir, overrideName)) && overrideName !== targetFilename) {
          renameCommands.push(`mv "${dir}/${overrideName}" "${dir}/${targetFilename}"`);
        }
      }
    } catch (e) {
      // ignore
    }
  });
});

if (renameCommands.length) {
  console.log('# Kopiér og kør disse kommandoer i terminalen for at ensarte filnavne:\n');
  renameCommands.forEach(cmd => console.log(cmd));
} else {
  console.log('# Alle filnavne er allerede ensartede i forhold til content.json');
}
