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

  async recentReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      let query = 'SELECT * FROM animal_reports';
      const params: unknown[] = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY submitted_at DESC LIMIT 20';

      const [rows] = await pool.query<RowDataPacket[]>(query, params);
      res.json({ success: true, reports: rows });
    } catch (err) { next(err); }
  },

  async petDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT p.*, pp.file_url AS primary_photo_url
         FROM pets p
         LEFT JOIN pet_photos pp ON pp.pet_id = p.pet_id AND pp.is_primary = 1
         WHERE p.pet_id = ? AND p.status = 'available'`,
        [req.params.id]
      );
      if (!rows[0]) {
        res.status(404).json({ success: false, message: 'Pet not found' });
        return;
      }

      const [photos] = await pool.query<RowDataPacket[]>(
        'SELECT photo_id, file_url, is_primary FROM pet_photos WHERE pet_id = ? ORDER BY is_primary DESC, uploaded_at ASC',
        [req.params.id]
      );

      const [healthRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM health_records WHERE pet_id = ? LIMIT 1',
        [req.params.id]
      );

      const [assetRows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM pet_3d_assets WHERE pet_id = ? LIMIT 1',
        [req.params.id]
      );

      res.json({
        success: true,
        pet: {
          ...rows[0],
          photos,
          health_record: healthRows[0] ?? null,
          asset_3d: assetRows[0] ?? null,
        },
      });
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
      const [[{ adopted }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS adopted FROM pets WHERE status = ?', ['adopted']);
      const [[{ available }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS available FROM pets WHERE status = ?', ['available']);
      const [[{ resolved }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS resolved FROM animal_reports WHERE status = ?', ['resolved']);
      const [[{ applications }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS applications FROM adoption_applications');

      res.json({
        success: true,
        stats: [
          { label: 'Pets Adopted', value: adopted },
          { label: 'Available Pets', value: available },
          { label: 'Rescues Completed', value: resolved },
          { label: 'Applications', value: applications },
        ],
      });
    } catch (err) { next(err); }
  },

  async latestModule(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT m.*, c.name AS category_name
         FROM elearning_modules m
         JOIN elearning_categories c ON c.category_id = m.category_id
         WHERE m.status = 'published'
         ORDER BY m.created_at DESC
         LIMIT 1`
      );
      res.json({ success: true, module: rows[0] ?? null });
    } catch (err) { next(err); }
  },
};
