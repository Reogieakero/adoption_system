import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import adminAuthRoutes from './routes/adminAuth.routes';
import petsRoutes from './routes/pets.routes';
import adoptionsRoutes from './routes/adoptions.routes';
import animalReportsRoutes from './routes/animal-reports.routes';
import healthRoutes from './routes/health.routes';
import heatmapRoutes from './routes/heatmap.routes';
import adminUsersRoutes from './routes/adminUsers.routes';
import notificationsRoutes from './routes/notifications.routes';
import learningModulesRoutes from './routes/learningModules.routes';
import messagesRoutes from './routes/messages.routes';
import logsRoutes from './routes/logs.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import settingsRoutes from './routes/settings.routes';
import publicRoutes from './routes/public.routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import path from 'path';

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/pets', petsRoutes);
app.use('/api/admin/adoptions', adoptionsRoutes);
app.use('/api/admin/animal-reports', animalReportsRoutes);
app.use('/api/admin/health', healthRoutes);
app.use('/api/admin/heatmap', heatmapRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/notifications', notificationsRoutes);
app.use('/api/admin/learning-modules', learningModulesRoutes);
app.use('/api/admin/messages', messagesRoutes);
app.use('/api/admin/logs', logsRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/settings', settingsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
