import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await userRepository.findByEmail(email);
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await userRepository.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userRepository.findByEmail(email);
    if (user && (await (user as any).matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
