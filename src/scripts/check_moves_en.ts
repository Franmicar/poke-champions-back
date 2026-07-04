import fs from 'fs';
const moves = JSON.parse(fs.readFileSync('../frontend/src/assets/i18n/en-US/moves.json', 'utf8'));
Object.entries(moves).forEach(([k, v]) => {
    if (/[áéíóúñÁÉÍÓÚÑ]/.test(v)) {
        console.log(`${k} : ${v}`);
    }
});
