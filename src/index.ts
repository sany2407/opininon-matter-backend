import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { checkConnection } from './config/database';
import newsletterRoutes from './routes/newsletter';
import blogRoutes from './routes/blogs';
import categoryRoutes from './routes/categories';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://opininon-matter.api.abielan.in'],
}));
app.use(express.json());

// Swagger Documentation
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

// Start server
async function startServer() {
  console.log('Checking database connection...');
  await checkConnection();
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}

startServer();
