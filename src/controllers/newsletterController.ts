import type { Request, Response } from 'express';
import { supabase } from '../config/database';

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Successfully subscribed', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
