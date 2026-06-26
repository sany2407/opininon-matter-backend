import type { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/database';

const BUCKET_NAME = 'blog-images';

export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Check if blog exists
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('id', id)
      .single();

    if (blogError || !blog) {
      res.status(404).json({ error: 'Blog not found' });
      return;
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `covers/${id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    // Update the blog's cover_image field
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ cover_image: urlData.publicUrl })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({
      message: 'Cover image uploaded successfully',
      url: urlData.publicUrl,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
