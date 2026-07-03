import express from 'express';
import { Team } from '../models/Team.js';

export const getTeams = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    const teams = await Team.find({ userId });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeam = async (req: express.Request, res: express.Response) => {
  try {
    const team = new Team(req.body);
    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTeam = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(updatedTeam);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTeam = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
