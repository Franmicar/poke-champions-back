import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
import Ability from '../models/Ability.js';
import Item from '../models/Item.js';
import Nature from '../models/Nature.js';

dotenv.config();

const I18N_PATH = path.resolve('../frontend/src/assets/i18n');

async function generate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions');
        console.log('🔍 Extrayendo datos para generar archivos de traducción...');

        const languages = ['en-US', 'es-ES', 'es-LA'];
        const data: any = {
            pokemon: await Pokemon.find(),
            moves: await Move.find(),
            abilities: await Ability.find(),
            items: await Item.find(),
            natures: await Nature.find()
        };

        for (const lang of languages) {
            console.log(`\n📦 Generando archivos para ${lang}...`);
            
            const translations: any = {
                pokemon: {},
                moves: {},
                abilities: {},
                items: {},
                natures: {},
                types: {
                    "type.normal": lang.startsWith('es') ? "Normal" : "Normal",
                    "type.fire": lang.startsWith('es') ? "Fuego" : "Fire",
                    "type.water": lang.startsWith('es') ? "Agua" : "Water",
                    "type.grass": lang.startsWith('es') ? "Planta" : "Grass",
                    "type.electric": lang.startsWith('es') ? "Eléctrico" : "Electric",
                    "type.ice": lang.startsWith('es') ? "Hielo" : "Ice",
                    "type.fighting": lang.startsWith('es') ? "Lucha" : "Fighting",
                    "type.poison": lang.startsWith('es') ? "Veneno" : "Poison",
                    "type.ground": lang.startsWith('es') ? "Tierra" : "Ground",
                    "type.flying": lang.startsWith('es') ? "Volador" : "Flying",
                    "type.psychic": lang.startsWith('es') ? "Psíquico" : "Psychic",
                    "type.bug": lang.startsWith('es') ? "Bicho" : "Bug",
                    "type.rock": lang.startsWith('es') ? "Roca" : "Rock",
                    "type.ghost": lang.startsWith('es') ? "Fantasma" : "Ghost",
                    "type.dragon": lang.startsWith('es') ? "Dragón" : "Dragon",
                    "type.dark": lang.startsWith('es') ? "Siniestro" : "Dark",
                    "type.steel": lang.startsWith('es') ? "Acero" : "Steel",
                    "type.fairy": lang.startsWith('es') ? "Hada" : "Fairy"
                },
                ui: {
                    "ui.common.add": lang.startsWith('es') ? "Añadir" : "Add",
                    "ui.common.delete": lang.startsWith('es') ? "Eliminar" : "Delete",
                    "ui.teambuilder.title": lang.startsWith('es') ? "Constructor de Equipos" : "Teambuilder"
                }
            };

            // Poblar desde DB
            data.pokemon.forEach((p: any) => translations.pokemon[p.key] = p.name);
            data.moves.forEach((m: any) => translations.moves[m.key] = m.name);
            data.abilities.forEach((a: any) => translations.abilities[a.key] = a.name);
            data.items.forEach((i: any) => translations.items[i.key] = i.name);
            data.natures.forEach((n: any) => {
                translations.natures[n.key] = (lang === 'en-US' && n.nameEn) ? n.nameEn : n.name;
            });

            // Escribir archivos
            const langPath = path.join(I18N_PATH, lang);
            if (!fs.existsSync(langPath)) fs.mkdirSync(langPath, { recursive: true });

            Object.keys(translations).forEach(domain => {
                const filePath = path.join(langPath, `${domain}.json`);
                fs.writeFileSync(filePath, JSON.stringify(translations[domain], null, 2), 'utf8');
                console.log(`   - ${domain}.json actualizado`);
            });
        }

        console.log('\n✅ ¡Archivos de traducción generados correctamente!');
    } catch (error) {
        console.error('❌ Error generando archivos:', error);
    } finally {
        await mongoose.disconnect();
    }
}

generate();
