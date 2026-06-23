import { Router } from 'express';
import { login } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { loginSchema } from '../validators/authValidator';

const router = Router();

router.post('/login', validate(loginSchema), login);

export default router;
