import { Router } from 'express';
import { getAllCategories, getCategoryById, createCategory } from '../controllers/categoryController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { createCategorySchema } from '../validators/categoryValidator';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, validate(createCategorySchema), createCategory);

export default router;
