import fs from 'fs';
import path from 'path';
import { Dex } from '@pkmn/dex';

const championsMoves = JSON.parse(fs.readFileSync('champions_moves_list.json', 'utf8'));
const currentESLA = JSON.parse(fs.readFileSync('../frontend/src/assets/i18n/es-LA/moves.json', 'utf8'));
const currentESES = JSON.parse(fs.readFileSync('../frontend/src/assets/i18n/es-ES/moves.json', 'utf8'));

// Cargar mapeos desde CSV
const csv = fs.readFileSync('move_names.csv', 'utf8');
const lines = csv.split('\n').slice(1);
const moveMap = {}; // move_id -> { 7: es, 9: en, 14: la }

lines.forEach(line => {
    const [move_id, lang_id, name] = line.split(',');
    if (!move_id || !lang_id || !name) return;
    if (!moveMap[move_id]) moveMap[move_id] = {};
    moveMap[move_id][lang_id] = name.trim();
});

// Crear diccionario Español -> Inglés
const esToEn = {};
Object.values(moveMap).forEach(m => {
    const en = m['9'];
    const esES = m['7'];
    const esLA = m['14'];
    if (en) {
        if (esES) esToEn[esES.toLowerCase()] = en;
        if (esLA) esToEn[esLA.toLowerCase()] = en;
    }
});

const enUS = {};
const esES = {};
const esLA = {};

championsMoves.forEach(key => {
    const slug = key.replace('move.', '');
    
    // 1. Determinar nombres en español
    let nameLA = currentESLA[key] || currentESES[key];
    let nameES = currentESES[key] || currentESLA[key];
    
    if (!nameLA) {
        const fallback = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        nameLA = fallback;
        nameES = fallback;
    }
    
    // 2. Determinar nombre en inglés usando el diccionario
    let nameEn = esToEn[nameLA.toLowerCase()] || esToEn[nameES.toLowerCase()];
    
    if (!nameEn) {
        // Fallback a la Dex si el CSV no lo tiene
        const dexMove = Dex.moves.get(slug.replace(/_/g, ''));
        if (dexMove && dexMove.exists) {
            nameEn = dexMove.name;
        } else {
            nameEn = nameLA; // Mantener español si no hay otra opción
        }
    }
    
    enUS[key] = nameEn;
    esLA[key] = nameLA;
    esES[key] = nameES;
});

// Correcciones manuales finales
const finalOverrides = {
    "move.a_bocajarro": "Close Combat",
    "move.abrecaminos": "Trailblaze",
    "move.agua_fra": "Chilling Water",
    "move.ala_bis": "Dual Wingbeat",
    "move.allanador_frreo": "Iron Roller",
    "move.alto_voltaje": "Rising Voltage",
    "move.arenas_ardientes": "Scorching Sands",
    "move.asalto_barrera": "Tera Blast",
    "move.bruma_explosiva": "Misty Explosion",
    "move.canto_ardiente": "Torch Song",
    "move.can_armadura": "Armor Cannon",
    "move.can_batidor": "Make It Rain",
    "move.erupcin_de_ira": "Fiery Wrath",
    "move.fra_acogida": "Chilly Reception",
    "move.furia_taurina": "Raging Bull",
    "move.hilo_venenoso": "Toxic Thread",
    "move.marcha_espectral": "Last Respects",
    "move.plumerazo": "Population Bomb",
    "move.pulso_noche": "Night Daze",
    "move.tajo_metralla": "Ceaseless Edge",
    "move.atiborramiento": "Stuff Cheeks",
    "move.autotoma": "Autotomize",
    "move.moluscan": "Shelly Arms",
    "move.ruina_funesta": "Ruination",
    "move.hidropulsacin": "Water Pulse",
    "move.pisotn": "Stomp",
    "move.rugido_de_guerra": "War Cry",
    "move.danza_amiga": "Friendly Dance"
};

Object.keys(finalOverrides).forEach(key => {
    if (enUS[key]) enUS[key] = finalOverrides[key];
});

const i18nPath = '../frontend/src/assets/i18n';
fs.writeFileSync(path.join(i18nPath, 'en-US/moves.json'), JSON.stringify(enUS, null, 2));
fs.writeFileSync(path.join(i18nPath, 'es-ES/moves.json'), JSON.stringify(esES, null, 2));
fs.writeFileSync(path.join(i18nPath, 'es-LA/moves.json'), JSON.stringify(esLA, null, 2));

console.log(`JSON files updated with ${Object.keys(enUS).length} moves using CSV dictionary.`);
