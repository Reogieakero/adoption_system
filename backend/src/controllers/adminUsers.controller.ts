import { Request, Response, NextFunction } from 'express';
import { getAllUsers, removeUser, setUserStatus, UserServiceError } from '../services/user.service';
import { UserStatus } from '../types/user.types';

const VALID_STATUSES: UserStatus[] = ['active', 'pending_verification', 'suspended'];

/**
 * GET /api/admin/users
 * Returns the full list of users for the admin management page,
 * sourced from the `adoption_system` database's `users` table
 * (joined with adoption/rescue/animal counts in the repository layer).
 */
export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/users/:id/status
 * Updates a single user's status (Active / Pending / Suspended).
 */
export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const { status } = req.body as { status: UserStatus };
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const user = await setUserStatus(id, status);
    res.json({ success: true, user });
  } catch (err) {
    if (err instanceof UserServiceError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    next(err);
  }
}

/**
 * DELETE /api/admin/users/:id
 * Permanently deletes a user record.
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    await removeUser(id);
    res.json({ success: true });
  } catch (err) {
    if (err instanceof UserServiceError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }
    next(err);
  }
}