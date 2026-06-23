import { Router } from 'express';
import { getAllBlogs, createBlog, updateBlog } from '../controllers/blogController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidator';

const router = Router();

router.get('/', getAllBlogs);
router.post('/', authenticate, validate(createBlogSchema), createBlog);
router.put('/:id', authenticate, validate(updateBlogSchema), updateBlog);

export default router;
