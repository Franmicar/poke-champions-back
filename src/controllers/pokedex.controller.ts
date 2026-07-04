import type { Request, Response } from 'express';
import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';
import Item from '../models/Item.js';

export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const pokemons = await Pokemon.find({}, 'id name key types baseStats abilities learnset sprite3d spriteIcon').lean();
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
    const abilities = await Ability.find({}).sort({ key: 1 }).lean();
    res.json(abilities);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({}).sort({ key: 1 }).lean();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
