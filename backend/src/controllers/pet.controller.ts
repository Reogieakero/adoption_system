import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';
import { petService } from '../services/pet.service';
import { CreatePetInput, UpdatePetInput } from '../types/pet.types';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { toPublicPhotoPath } from '../middleware/upload';

export const petController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pets = await petService.listPets();
      res.json({ success: true, pets });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pet = await petService.getPetById(Number(req.params.id));
      res.json({ success: true, pet });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let adminId = (req as any).admin?.id ?? (req as any).user?.id;
      if (!adminId) {
        const adminEmail = (req as any).admin?.email;
        if (adminEmail) {
          const [rows] = await pool.query<RowDataPacket[]>('SELECT user_id FROM users WHERE email = ?', [adminEmail]);
          adminId = rows[0]?.user_id;
        }
        if (!adminId) {
          const [result] = await pool.query<RowDataPacket[]>('SELECT user_id FROM users WHERE role = ? LIMIT 1', ['admin']);
          adminId = result[0]?.user_id ?? 1;
        }
      }
      const input: CreatePetInput = {
        ...(req.body as CreatePetInput),
        created_by_user_id: adminId,
      };
      const pet = await petService.createPet(input);
      res.status(201).json({ success: true, pet });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdatePetInput = req.body as UpdatePetInput;
      const pet = await petService.updatePet(Number(req.params.id), input);
      res.json({ success: true, pet });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async generate3D(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pet = await petService.generate3DModel(Number(req.params.id));
      res.json({ success: true, pet });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async generate3DDescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body as { prompt?: string };
      if (!prompt || !prompt.trim()) {
        res.status(400).json({ success: false, message: 'Description prompt is required' });
        return;
      }
      const pet = await petService.generate3DFromDescription(Number(req.params.id), prompt.trim());
      res.json({ success: true, pet });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = (req as any).admin?.id ?? 1;
      await petService.deletePet(Number(req.params.id), adminId);
      res.json({ success: true, message: 'Pet deleted successfully' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};
