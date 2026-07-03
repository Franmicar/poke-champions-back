import { calculate, Pokemon, Move, Field } from '@smogon/calc';
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

const gen = new Generations(Dex).get(9);

// Champions Stat Calculation
function calcStatChampions(stat: string, base: number, ev: number, nature: string): number {
    if (stat === 'hp') {
        return base === 1 ? 1 : base + ev + 75;
    }
    // Simple nature mock
    let n = 1;
    if (nature === 'Adamant' && stat === 'atk') n = 1.1;
    if (nature === 'Adamant' && stat === 'spa') n = 0.9;
    return Math.floor((base + ev + 20) * n);
}

const attacker = new Pokemon(gen, 'Gengar', {
    nature: 'Adamant',
    evs: { atk: 32 },
});

// Override stats
attacker.stats.atk = calcStatChampions('atk', 65, 32, 'Adamant'); 
attacker.stats.hp = calcStatChampions('hp', 60, 0, 'Adamant'); 

console.log('Overridden Atk:', attacker.stats.atk);
console.log('Overridden HP:', attacker.stats.hp);

const defender = new Pokemon(gen, 'Blissey', {
    evs: { hp: 0, def: 0 },
});
defender.stats.hp = calcStatChampions('hp', 255, 0, 'Serious');
defender.stats.def = calcStatChampions('def', 10, 0, 'Serious');

const move = new Move(gen, 'Fire Punch'); 
const field = new Field();

const result = calculate(gen, attacker, defender, move, field);

console.log('Damage result:', result.damage);
console.log('Description:', result.desc());
