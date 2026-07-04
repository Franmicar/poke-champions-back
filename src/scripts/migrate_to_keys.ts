import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
import Ability from '../models/Ability.js';
import Item from '../models/Item.js';
import Nature from '../models/Nature.js';

dotenv.config();

/**
 * Genera una clave siguiendo el estándar: dominio.nombre_slugificado
 */
function toKey(domain: string, name: string): string {
    if (!name) return '';
    const slug = name.toLowerCase()
        .trim()
        .replace(/[-\s]+/g, '_') // Espacios y guiones a guiones bajos
        .replace(/[^a-z0-9_]/g, ''); // Eliminar caracteres especiales
    return `${domain}.${slug}`;
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions');
        console.log('🚀 Conectado a MongoDB para migración...');

        // 1. Migrar Pokémon
        const pokemons = await Pokemon.find({ key: { $exists: false } });
        console.log(`- Migrando ${pokemons.length} Pokémon...`);
        for (const p of pokemons) {
            p.key = toKey('pokemon', p.name);
            await p.save();
        }

        // 2. Migrar Movimientos
        const moves = await Move.find({ key: { $exists: false } });
        console.log(`- Migrando ${moves.length} Movimientos...`);
        for (const m of moves) {
            m.key = toKey('move', m.name);
            await m.save();
        }

        // 3. Migrar Habilidades
        const abilities = await Ability.find({ key: { $exists: false } });
        console.log(`- Migrando ${abilities.length} Habilidades...`);
        for (const a of abilities) {
            a.key = toKey('ability', a.name);
            await a.save();
        }

        // 4. Migrar Objetos
        const items = await Item.find({ key: { $exists: false } });
        console.log(`- Migrando ${items.length} Objetos...`);
        for (const i of items) {
            i.key = toKey('item', i.name);
            await i.save();
        }

        // 5. Migrar Naturalezas
        const natures = await Nature.find({ key: { $exists: false } });
        console.log(`- Migrando ${natures.length} Naturalezas...`);
        for (const n of natures) {
            // Para naturalezas usamos el nombre en inglés como base de la clave
            n.key = toKey('nature', n.nameEn || n.name);
            await n.save();
        }

        console.log('✅ Migración de claves completada con éxito.');
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
