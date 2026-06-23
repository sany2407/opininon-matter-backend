import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required').max(255),
  category_id: z.number().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
  published_date: z.string().optional().nullable(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  slug: z.string().min(1).max(255).optional(),
  category_id: z.number().optional().nullable(),
  status: z.enum(['draft', 'published']).optional(),
  published_date: z.string().optional().nullable(),
});
