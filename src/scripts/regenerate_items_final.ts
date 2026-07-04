import fs from 'fs';
import path from 'path';

const itemsWiki = [
    "Baya Zreza", "Baya Atania", "Baya Duraz/Baya Meloc", "Baya Safre", "Baya Perasi",
    "Baya Zanama", "Baya Aranja", "Baya Caquic", "Baya Ziuela", "Baya Citrón/Baya Zidra",
    "Baya Caoca", "Baya Pasio", "Baya Gualot", "Baya Tamar", "Baya Rimoya",
    "Baya Pomaro", "Baya Kebia", "Baya Acardo", "Baya Kouba", "Baya Payapa",
    "Baya Yecana", "Baya Alcho", "Baya Drasi", "Baya Anjiro", "Baya Dillo",
    "Baya Baribá", "Baya Chilan", "Polvo Brillo", "Hierba Blanca", "Garra Rápida",
    "Hierba Mental", "Roca del Rey", "Polvo Plata", "Cinta Aguante", "Periscopio",
    "Revestimiento Metálico", "Restos", "Bola Luminosa", "Arena Fina", "Piedra Dura",
    "Semilla Milagro", "Lentes de Sol/Gafas de Sol", "Cinturón Negro", "Imán",
    "Agua Mística", "Pico Afilado", "Flecha Venenosa", "Hielo Perpetuo", "Hechizo",
    "Cuchara Torcida", "Carbón", "Colmillo Dragón/Colmillo de Dragón", "Pañuelo de Seda",
    "Cascabel Nácar/Cascabel Concha", "Lupa", "Cinta Fuerte", "Lentes Especiales/Gafas Especiales",
    "Cinturón de Experto", "Refleluz", "Vidasfera", "Banda Aguante", "Telescopio",
    "Metrónomo", "Bola Férrea", "Roca Helada", "Roca Suave", "Roca Calor",
    "Roca Lluvia", "Pañuelo Elección", "Muda de Piel/Muda Concha", "Raíz Grande",
    "Gengarita", "Gardevoirita", "Ampharosita", "Venusaurita", "Charizardita X",
    "Blastoisita", "Blazikenita", "Medichamita", "Houndoomita", "Aggronita",
    "Banettita", "Tyranitarita", "Scizorita", "Pinsirita", "Aerodactylita",
    "Lucarita", "Abomasnowita", "Kangaskhanita", "Gyaradosita", "Absolita",
    "Charizardita Y", "Alakazamita", "Heracrossita", "Mawilita", "Manectricita",
    "Garchompita", "Baya Hibis", "Swampertita", "Sceptilita", "Sableynita",
    "Altarianita", "Galladita", "Audinita", "Metagrossita", "Sharpedonita",
    "Slowbronita", "Steelixita", "Pidgeotita", "Glalita", "Cameruptita",
    "Lopunnita", "Beedrillita", "Pluma Feérica", "Clefablita", "Victreebelita",
    "Starmita", "Dragonitita", "Meganiumita", "Feraligatrita", "Skarmorita",
    "Froslassita", "Emboarita", "Excadrillita", "Scolipedita", "Scraftita",
    "Eelektrossita", "Chandelurita", "Chesnaughtita", "Delphoxita", "Greninjanita",
    "Pyroarita", "Floettita", "Malamarita", "Barbaraclita", "Dragalgita",
    "Hawluchanita", "Drampanita", "Falinksita", "Raichunita X", "Raichunita Y",
    "Chimechita", "Staraptorita", "Golurkita", "Meowsticita", "Crabominablita",
    "Scovillainita", "Glimmoranita"
];

// Mapeo manual de nombres en inglés para consistencia
const enMapping = {
    "Baya Zreza": "Cheri Berry", "Baya Atania": "Chesto Berry", "Baya Duraz/Baya Meloc": "Pecha Berry",
    "Baya Safre": "Rawst Berry", "Baya Perasi": "Aspear Berry", "Baya Zanama": "Leppa Berry",
    "Baya Aranja": "Oran Berry", "Baya Caquic": "Persim Berry", "Baya Ziuela": "Lum Berry",
    "Baya Citrón/Baya Zidra": "Sitrus Berry", "Baya Caoca": "Occa Berry", "Baya Pasio": "Passho Berry",
    "Baya Gualot": "Wacan Berry", "Baya Tamar": "Rindo Berry", "Baya Rimoya": "Yache Berry",
    "Baya Pomaro": "Chople Berry", "Baya Kebia": "Kebia Berry", "Baya Acardo": "Shuca Berry",
    "Baya Kouba": "Coba Berry", "Baya Payapa": "Payapa Berry", "Baya Yecana": "Tanga Berry",
    "Baya Alcho": "Charti Berry", "Baya Drasi": "Kasib Berry", "Baya Anjiro": "Haban Berry",
    "Baya Dillo": "Colbur Berry", "Baya Baribá": "Babiri Berry", "Baya Chilan": "Chilan Berry",
    "Polvo Brillo": "Bright Powder", "Hierba Blanca": "White Herb", "Garra Rápida": "Quick Claw",
    "Hierba Mental": "Mental Herb", "Roca del Rey": "King's Rock", "Polvo Plata": "Silver Powder",
    "Cinta Aguante": "Focus Band", "Periscopio": "Scope Lens", "Revestimiento Metálico": "Metal Coat",
    "Restos": "Leftovers", "Bola Luminosa": "Light Ball", "Arena Fina": "Soft Sand",
    "Piedra Dura": "Hard Stone", "Semilla Milagro": "Miracle Seed", "Lentes de Sol/Gafas de Sol": "Black Glasses",
    "Cinturón Negro": "Black Belt", "Imán": "Magnet", "Agua Mística": "Mystic Water",
    "Pico Afilado": "Sharp Beak", "Flecha Venenosa": "Poison Barb", "Hielo Perpetuo": "Never-Melt Ice",
    "Hechizo": "Spell Tag", "Cuchara Torcida": "Twisted Spoon", "Carbón": "Charcoal",
    "Colmillo Dragón/Colmillo de Dragón": "Dragon Fang", "Pañuelo de Seda": "Silk Scarf",
    "Cascabel Nácar/Cascabel Concha": "Shell Bell", "Lupa": "Wide Lens", "Cinta Fuerte": "Muscle Band",
    "Lentes Especiales/Gafas Especiales": "Wise Glasses", "Cinturón de Experto": "Expert Belt",
    "Refleluz": "Light Clay", "Vidasfera": "Life Orb", "Banda Aguante": "Focus Sash",
    "Telescopio": "Zoom Lens", "Metrónomo": "Metronome", "Bola Férrea": "Iron Ball",
    "Roca Helada": "Icy Rock", "Roca Suave": "Smooth Rock", "Roca Calor": "Heat Rock",
    "Roca Lluvia": "Damp Rock", "Pañuelo Elección": "Choice Scarf", "Muda de Piel/Muda Concha": "Shed Shell",
    "Raíz Grande": "Big Root", "Pluma Feérica": "Fairy Feather", "Baya Hibis": "Roseli Berry"
};

const enUS = {};
const esES = {};
const esLA = {};

function slugify(text) {
    return text.toLowerCase()
        .replace(/[-\s]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

itemsWiki.forEach(item => {
    let nameLA = item;
    let nameES = item;

    if (item.includes('/')) {
        const parts = item.split('/');
        nameLA = parts[0].trim();
        nameES = parts[1].trim();
    }

    // Deducir nombre en inglés
    let nameEn = enMapping[item];
    if (!nameEn) {
        // Para Megas: Gengarita -> Gengarite
        if (item.endsWith('ita')) nameEn = item.replace(/ita$/, 'ite');
        else if (item.endsWith('ita X')) nameEn = item.replace(/ita X$/, 'ite X');
        else if (item.endsWith('ita Y')) nameEn = item.replace(/ita Y$/, 'ite Y');
        else nameEn = nameLA;
    }

    const key = `item.${slugify(nameEn)}`;

    enUS[key] = nameEn;
    esLA[key] = nameLA;
    esES[key] = nameES;
});

const i18nPath = '../frontend/src/assets/i18n';

fs.writeFileSync(path.join(i18nPath, 'en-US/items.json'), JSON.stringify(enUS, null, 2));
fs.writeFileSync(path.join(i18nPath, 'es-ES/items.json'), JSON.stringify(esES, null, 2));
fs.writeFileSync(path.join(i18nPath, 'es-LA/items.json'), JSON.stringify(esLA, null, 2));

console.log(`JSON files regenerated with ${Object.keys(enUS).length} items.`);
