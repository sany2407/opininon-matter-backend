import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../config/database';
import { env } from '../config/env';
import type { JwtPayload } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    const { data: users, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username);

    if (error) {
      console.error('Database error:', error);
      return res.status(401).json({ error: 'Invalid credentials', details: error.message });
    }

    if (!users || users.length === 0) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials', details: 'User not found' });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials', details: 'Invalid password' });
    }

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });

    console.log('Login successful for:', username);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message, details: error });
  }
};
