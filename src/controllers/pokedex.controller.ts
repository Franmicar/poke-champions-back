import type { Request, Response } from 'express';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
import Item from '../models/Item.js';

export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const pokemons = await Pokemon.find({}, 'name types baseStats abilities learnset').lean();
    res.json(pokemons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPokemonByName = async (req: Request, res: Response) => {
  try {
    const pokemon = await Pokemon.findOne({ name: req.params.name }).lean();
    if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });
    res.json(pokemon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMoves = async (req: Request, res: Response) => {
  try {
    const moves = await Move.find({}).lean();
    res.json(moves);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAbilities = async (req: Request, res: Response) => {
  try {
    // Get unique abilities from all pokemon
    const pokemons = await Pokemon.find({}, 'abilities').lean();
    const abilitiesSet = new Set<string>();
    pokemons.forEach(p => {
      p.abilities?.forEach(a => abilitiesSet.add(a));
    });
    res.json(Array.from(abilitiesSet).sort());
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({}).sort({ name: 1 }).lean();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
