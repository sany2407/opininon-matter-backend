import type { Request, Response } from 'express';
import { supabase } from '../config/database';

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const categoryId = req.query.category_id as string;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('blogs')
      .select('*, categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, slug, category_id, status, published_date } = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        content,
        slug,
        category_id,
        status,
        published_date: published_date || null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Blog created successfully', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Blog updated successfully', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
