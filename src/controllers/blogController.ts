import type { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/database';

const BUCKET_NAME = 'blog-images';

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

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('blogs')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Blog not found' });
        return;
      }
      throw error;
    }

    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, slug, category_id, status, published_date, cover_image } = req.body;

    let imageUrl = cover_image || null;

    // If a file was uploaded, upload it to Supabase Storage
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title,
        content,
        slug,
        category_id: category_id ? Number(category_id) : null,
        status,
        published_date: published_date || null,
        cover_image: imageUrl,
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
    const updates = { ...req.body };

    // Convert category_id to number if present
    if (updates.category_id) {
      updates.category_id = Number(updates.category_id);
    }

    // If a file was uploaded, upload it to Supabase Storage
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `covers/${id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      updates.cover_image = urlData.publicUrl;
    }

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
