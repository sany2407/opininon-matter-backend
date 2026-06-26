import type { Request, Response } from 'express';
import { supabase } from '../config/database';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    console.log('Fetching categories...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    console.log('Categories fetched:', data);
    res.json({ data });
  } catch (error: any) {
    console.error('Categories error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      throw error;
    }

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Category created successfully', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
