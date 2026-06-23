import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController';
import { validate } from '../middleware/validation';
import { subscribeSchema } from '../validators/newsletterValidator';

const router = Router();

router.post('/subscribe', validate(subscribeSchema), subscribe);

export default router;
