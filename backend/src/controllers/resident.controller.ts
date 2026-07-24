import { Request, Response, NextFunction } from 'express';
import { adoptionService } from '../services/adoption.service';
import { animalReportService } from '../services/animalReport.service';
import { learningModuleService } from '../services/learningModule.service';
import { notificationService } from '../services/notification.service';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { CreateAnimalReportInput } from '../types/animalReport.types';
import { ProgressStatus } from '../types/learningModule.types';
import { findAdminUsers } from '../repositories/user.repository';

export const residentController = {
  // ── Adoption Applications ──────────────────────────────────────────
  async listMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await adoptionService.getMyApplications(req.user!.id);
      res.json({ success: true, applications });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async getMyApplicationDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const app = await adoptionService.getApplicationDetails(Number(req.params.id));
      if (app.resident_id !== req.user!.id) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      res.json({ success: true, application: app });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async submitApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pet_id, reason_for_adopting, living_situation, has_other_pets, household_members_count, additional_notes } = req.body;
      if (!pet_id) {
        res.status(400).json({ success: false, message: 'pet_id is required' });
        return;
      }
      const application = await adoptionService.createApplication({
        pet_id,
        resident_id: req.user!.id,
        reason_for_adopting: reason_for_adopting ?? null,
        living_situation: living_situation ?? null,
        has_other_pets: has_other_pets ?? null,
        household_members_count: household_members_count ?? null,
        additional_notes: additional_notes ?? null,
      });
      res.status(201).json({ success: true, application });
    } catch (err) { handleServiceError(err, res, next); }
  },

  // ── Rescue Reports ────────────────────────────────────────────────
  async listMyReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await animalReportService.getMyReports(req.user!.id);
      res.json({ success: true, reports });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async getMyReportDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await animalReportService.getReportById(Number(req.params.id));
      if (report.resident_id !== req.user!.id) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      res.json({ success: true, report });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async submitReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { species, condition_description, photo_url, latitude, longitude, location_area, contact_preference } = req.body;
      if (!species || !condition_description || !photo_url || latitude === undefined || longitude === undefined) {
        res.status(400).json({ success: false, message: 'species, condition_description, photo_url, latitude, and longitude are required' });
        return;
      }
      const input: CreateAnimalReportInput = {
        resident_id: req.user!.id,
        species,
        condition_description,
        photo_url,
        latitude,
        longitude,
        location_area: location_area ?? null,
        contact_preference: contact_preference ?? null,
      };
      const report = await animalReportService.createReport(input);
      res.status(201).json({ success: true, report });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async uploadReportPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'No files uploaded' });
        return;
      }
      const urls = files.map((f) => `/uploads/reports/${f.filename}`);
      res.json({ success: true, urls });
    } catch (err) { handleServiceError(err, res, next); }
  },

  // ── Learning Modules ──────────────────────────────────────────────
  async listPublishedModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const modules = await learningModuleService.listPublishedModulesWithProgress(req.user!.id);
      res.json({ success: true, modules });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async getPublishedModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mod = await learningModuleService.getModuleById(Number(req.params.id));
      if (mod.status !== 'published') {
        res.status(404).json({ success: false, message: 'Module not found' });
        return;
      }
      res.json({ success: true, module: mod });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async getMyProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const progress = await learningModuleService.getProgress(Number(req.params.id), req.user!.id);
      res.json({ success: true, progress });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async updateMyProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body as { status: ProgressStatus };
      if (!status) {
        res.status(400).json({ success: false, message: 'status is required' });
        return;
      }
      const progress = await learningModuleService.updateProgress(Number(req.params.id), req.user!.id, status);
      res.json({ success: true, progress });
    } catch (err) { handleServiceError(err, res, next); }
  },

  // ── Notifications ─────────────────────────────────────────────────
  async listMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await notificationService.list({ recipient_id: req.user!.id, page, limit });
      res.json({ success: true, ...result });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await notificationService.list({ recipient_id: req.user!.id, page: 1, limit: 1 });
      res.json({ success: true, unreadCount: result.unreadCount });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async markNotificationRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notification = await notificationService.markAsRead(Number(req.params.id));
      if (notification.recipient_id !== req.user!.id) {
        res.status(403).json({ success: false, message: 'Access denied' });
        return;
      }
      res.json({ success: true, notification });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async markAllNotificationsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await notificationService.markAllAsRead();
      res.json({ success: true, count });
    } catch (err) { handleServiceError(err, res, next); }
  },

  async listChatAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admins = await findAdminUsers();
      res.json({ success: true, data: admins });
    } catch (err) { handleServiceError(err, res, next); }
  },
};
