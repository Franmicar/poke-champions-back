import { calculate, Pokemon, Move, Field } from '@smogon/calc';
import { Generations } from '@pkmn/data';

const gen = Generations.get(9); // Using Gen 9 as base
const result = calculate(
  gen,
  new Pokemon(gen, 'Gengar', {
    item: 'Life Orb',
    nature: 'Timid',
    evs: { spa: 252 },
  }),
  new Pokemon(gen, 'Blissey', {
    item: 'Leftovers',
    nature: 'Bold',
    evs: { hp: 252, def: 252 },
  }),
  new Move(gen, 'Shadow Ball'),
  new Field()
);

console.log('Standard Calc Result:', result.damage);
