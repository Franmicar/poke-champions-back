import express from 'express';
import { getAllPokemon, getPokemonByName, getMoves, getAbilities, getItems } from '../controllers/pokedex.controller.js';
import { getAllNatures } from '../controllers/natures.controller.js';

const router = express.Router();

router.get('/pokemon', getAllPokemon);
router.get('/pokemon/:name', getPokemonByName);
router.get('/moves', getMoves);
router.get('/abilities', getAbilities);
router.get('/items', getItems);
router.get('/natures', getAllNatures);

export default router;
