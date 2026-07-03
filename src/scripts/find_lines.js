import fs from 'fs';

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('Pokémon Champions')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
