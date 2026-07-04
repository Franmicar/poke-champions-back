import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
import Ability from '../models/Ability.js';

dotenv.config();

function toKey(domain: string, name: string): string {
    if (!name) return '';
    const slug = name.toLowerCase()
        .trim()
        .replace(/[-\s]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    return `${domain}.${slug}`;
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon_champions');
        console.log('🚀 Iniciando migración de referencias internas...');

        // 1. Migrar Tipos en Pokémon
        console.log('- Actualizando tipos en Pokémon...');
        const pokemons = await Pokemon.find();
        for (const p of pokemons) {
            p.types = p.types.map(t => toKey('type', t));
            p.abilities = p.abilities.map(a => toKey('ability', a));
            p.learnset = p.learnset.map(m => m.includes('.') ? m : toKey('move', m));
            await p.save();
        }

        // 2. Migrar Tipos y Categorías en Movimientos
        console.log('- Actualizando tipos y categorías en Movimientos...');
        const moves = await Move.find();
        for (const m of moves) {
            m.type = toKey('type', m.type);
            // Las categorías son fijas: físico, especial, estado
            if (!m.category.includes('.')) {
                const cat = m.category.toLowerCase();
                m.category = cat.includes('físico') ? 'category.physical' : 
                             cat.includes('especial') ? 'category.special' : 'category.status';
            }
            await m.save();
        }

        console.log('✅ Migración de referencias completada.');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
