import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

export const publicController = {
  async featuredPets(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT p.*, pp.file_url AS primary_photo_url
         FROM pets p
         LEFT JOIN pet_photos pp ON pp.pet_id = p.pet_id AND pp.is_primary = 1
         WHERE p.status = 'available'
         ORDER BY p.created_at DESC
         LIMIT 4`
      );
      res.json({ success: true, pets: rows });
    } catch (err) { next(err); }
  },

  async recentReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM animal_reports ORDER BY submitted_at DESC LIMIT 3`
      );
      res.json({ success: true, reports: rows });
    } catch (err) { next(err); }
  },

  async allPets(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT p.*, pp.file_url AS primary_photo_url
         FROM pets p
         LEFT JOIN pet_photos pp ON pp.pet_id = p.pet_id AND pp.is_primary = 1
         WHERE p.status = 'available'
         ORDER BY p.created_at DESC`
      );
      res.json({ success: true, pets: rows });
    } catch (err) { next(err); }
  },

  async testimonials(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        testimonials: [
          {
            id: 'T001',
            name: 'Maria Santos',
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
            quote: 'Adopting Luna through PawConnect was the best decision we ever made. The team guided us through every step and made sure she was the perfect fit for our family.',
            animalAdopted: 'Luna',
          },
          {
            id: 'T002',
            name: 'James Reyes',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            quote: 'We found our beloved Milo through this platform. The rescue team was incredibly supportive, and Milo has brought so much joy into our home.',
            animalAdopted: 'Milo',
          },
          {
            id: 'T003',
            name: 'Ana Cruz',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
            quote: 'I was nervous about adopting a senior dog, but the PawConnect team assured me every step of the way. Bella is now the queen of our household!',
            animalAdopted: 'Bella',
          },
        ],
      });
    } catch (err) { next(err); }
  },

  async impactStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        stats: [
          { label: 'Pets Adopted', value: 150, suffix: '+' },
          { label: 'Rescues Completed', value: 320, suffix: '+' },
          { label: 'Active Volunteers', value: 85, suffix: '' },
        ],
      });
    } catch (err) { next(err); }
  },
};
