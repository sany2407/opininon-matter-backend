import { Router } from 'express';
import multer from 'multer';
import { uploadCoverImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Store files in memory (buffer) for direct upload to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

router.post('/:id/cover-image', authenticate, upload.single('image'), uploadCoverImage);

export default router;
