import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
import { userRepository } from '../repositories/user.repository';
import { notificationPreferenceRepository } from '../repositories/notificationPreference.repository';
import { appSettingsRepository } from '../repositories/appSettings.repository';
import { logService } from '../services/log.service';
import { AppError } from '../errors/AppError';

export const settingsController = {
  // ─── Profile ──────────────────────────────────────────────

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin!.id;
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError(404, 'Admin user not found');
      }
      res.json({
        success: true,
        profile: {
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          address: user.address,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin!.id;
      const { full_name, phone_number, address } = req.body;

      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError(404, 'Admin user not found');
      }

      await userRepository.updateUserProfile(userId, {
        full_name: full_name ?? user.full_name,
        phone_number: phone_number !== undefined ? phone_number : user.phone_number,
        address: address !== undefined ? address : user.address,
      });

      await logService.logAction({
        userId,
        action: 'Updated',
        entityType: 'Settings',
        description: 'Profile settings updated',
      });

      const updated = await userRepository.findById(userId);
      res.json({
        success: true,
        profile: {
          full_name: updated!.full_name,
          email: updated!.email,
          phone_number: updated!.phone_number,
          address: updated!.address,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // ─── Change Password ──────────────────────────────────────

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin!.id;
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        throw new AppError(400, 'Current password and new password are required');
      }

      if (new_password.length < 8) {
        throw new AppError(400, 'New password must be at least 8 characters');
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        throw new AppError(404, 'Admin user not found');
      }

      if (user.password_hash) {
        const valid = await bcrypt.compare(current_password, user.password_hash);
        if (!valid) {
          throw new AppError(401, 'Current password is incorrect');
        }
      }

      const hash = await bcrypt.hash(new_password, 10);
      await userRepository.updatePassword(userId, hash);

      await logService.logAction({
        userId,
        action: 'Updated',
        entityType: 'Settings',
        description: 'Password changed',
      });

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  },

  // ─── Notification Preferences ─────────────────────────────

  async getNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin!.id;
      let prefs = await notificationPreferenceRepository.findByUserId(userId);

      if (prefs.length === 0) {
        await notificationPreferenceRepository.setDefaults(userId);
        prefs = await notificationPreferenceRepository.findByUserId(userId);
      }

      const map: Record<string, { in_app: boolean; email: boolean }> = {};
      for (const p of prefs) {
        map[p.notification_type] = { in_app: p.in_app_enabled, email: p.email_enabled };
      }

      res.json({ success: true, preferences: map });
    } catch (err) {
      next(err);
    }
  },

  // ─── App Settings (maps, elearning, system, security) ─────

  async getAppSettings(_req: Request, res: Response, next: NextFunction) {
    try {
      const raw = await appSettingsRepository.getAll();
      res.json({ success: true, settings: raw });
    } catch (err) {
      next(err);
    }
  },

  async updateAppSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { settings } = req.body;
      if (!settings || typeof settings !== 'object') {
        throw new AppError(400, 'Settings object is required');
      }
      const sanitized: Record<string, string> = {};
      for (const [key, value] of Object.entries(settings)) {
        sanitized[key] = String(value);
      }
      await appSettingsRepository.setMany(sanitized);

      await logService.logAction({
        userId: req.admin!.id,
        action: 'Updated',
        entityType: 'Settings',
        description: `App settings updated: ${Object.keys(sanitized).join(', ')}`,
      });

      const updated = await appSettingsRepository.getAll();
      res.json({ success: true, settings: updated });
    } catch (err) {
      next(err);
    }
  },

  async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.admin!.id;
      const { preferences } = req.body;

      if (!preferences || typeof preferences !== 'object') {
        throw new AppError(400, 'Preferences object is required');
      }

      for (const [type, value] of Object.entries(preferences)) {
        const v = value as { in_app?: boolean; email?: boolean };
        await notificationPreferenceRepository.upsert(
          userId,
          type as any,
          v.in_app ?? true,
          v.email ?? true
        );
      }

      await logService.logAction({
        userId,
        action: 'Updated',
        entityType: 'Settings',
        description: 'Notification preferences updated',
      });

      const updated = await notificationPreferenceRepository.findByUserId(userId);
      const map: Record<string, { in_app: boolean; email: boolean }> = {};
      for (const p of updated) {
        map[p.notification_type] = { in_app: p.in_app_enabled, email: p.email_enabled };
      }

      res.json({ success: true, preferences: map });
    } catch (err) {
      next(err);
    }
  },
};
