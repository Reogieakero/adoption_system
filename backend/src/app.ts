import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import adminAuthRoutes from './routes/adminAuth.routes';
import animalsRoutes from './routes/animals.routes';
import adoptionsRoutes from './routes/adoptions.routes';
import rescuesRoutes from './routes/rescues.routes';
import healthRoutes from './routes/health.routes';
import heatmapRoutes from './routes/heatmap.routes';
import adminUsersRoutes from './routes/adminUsers.routes';
import notificationsRoutes from './routes/notifications.routes';
import learningModulesRoutes from './routes/learningModules.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import path from 'path';

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/animals', animalsRoutes);
app.use('/api/admin/adoptions', adoptionsRoutes);
app.use('/api/admin/rescues', rescuesRoutes);
app.use('/api/admin/health', healthRoutes);
app.use('/api/admin/heatmap', heatmapRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/notifications', notificationsRoutes);
app.use('/api/admin/learning-modules', learningModulesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;