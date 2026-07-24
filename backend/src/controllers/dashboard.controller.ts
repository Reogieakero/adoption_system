import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

export const dashboardController = {
  async stats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [[pendingAdoptions]] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM adoption_applications WHERE status = 'pending_review'"
      );
      const [[activeReports]] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM animal_reports WHERE status IN ('submitted','in_progress')"
      );
      const [[healthAlerts]] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM health_records WHERE heart_rate_bpm > 140"
      );
      const [[unreadNotifs]] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS count FROM notifications WHERE is_read = 0"
      );

      res.json({
        success: true,
        stats: [
          { label: 'Pending Adoptions', value: String(pendingAdoptions.count), subtext: 'Awaiting coordinator review', icon: 'ClipboardCheck' },
          { label: 'Rescue Reports', value: String(activeReports.count), subtext: 'Active dispatch cases', icon: 'Siren' },
          { label: 'Health Alerts', value: String(healthAlerts.count), subtext: 'Critical medical updates', icon: 'HeartPulse' },
          { label: 'Notifications', value: String(unreadNotifs.count), subtext: 'Unread administrative updates', icon: 'Bell' },
        ],
      });
    } catch (err) { next(err); }
  },

  async recentReports(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT ar.report_id, ar.species, ar.photo_url,
                ar.location_area, ar.status, ar.submitted_at,
                u.full_name AS resident_name
         FROM animal_reports ar
         LEFT JOIN users u ON u.user_id = ar.resident_id
         ORDER BY ar.submitted_at DESC LIMIT 5`
      );
      res.json({ success: true, reports: rows });
    } catch (err) { next(err); }
  },

  async recentAdoptions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT aa.application_id, aa.pet_id, aa.handover_confirmed_at,
                p.name AS pet_name, p.breed_detail, p.species,
                pp.file_url AS photo_url,
                u.full_name AS adopter_name
         FROM adoption_applications aa
         JOIN pets p ON p.pet_id = aa.pet_id
         LEFT JOIN pet_photos pp ON pp.pet_id = p.pet_id AND pp.is_primary = 1
         JOIN users u ON u.user_id = aa.resident_id
         WHERE aa.handover_confirmed_at IS NOT NULL
         ORDER BY aa.handover_confirmed_at DESC LIMIT 5`
      );
      res.json({ success: true, adoptions: rows });
    } catch (err) { next(err); }
  },

  async adoptionTrends(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(submitted_at, '%b') AS label, COUNT(*) AS value
         FROM adoption_applications
         WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY DATE_FORMAT(submitted_at, '%b')
         ORDER BY MIN(submitted_at) ASC`
      );
      res.json({ success: true, trends: rows });
    } catch (err) { next(err); }
  },

  async rescueEfficiency(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(submitted_at, '%b') AS label,
                ROUND(AVG(TIMESTAMPDIFF(HOUR, submitted_at, resolved_at)), 1) AS value
         FROM animal_reports
         WHERE resolved_at IS NOT NULL
           AND submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
         GROUP BY DATE_FORMAT(submitted_at, '%b')
         ORDER BY MIN(submitted_at) ASC`
      );
      const total = rows.reduce((sum: number, r: RowDataPacket) => sum + Number(r.value), 0);
      const avg = rows.length > 0 ? (total / rows.length).toFixed(1) : '0';
      res.json({ success: true, trends: rows, average: avg });
    } catch (err) { next(err); }
  },

  async geoDistribution(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT COALESCE(NULLIF(location_area, ''), 'Unknown') AS label, COUNT(*) AS value
         FROM animal_reports
         WHERE status IN ('submitted', 'in_progress', 'dispatched')
         GROUP BY label
         ORDER BY value DESC
         LIMIT 10`
      );
      const total = rows.reduce((sum: number, r: RowDataPacket) => sum + Number(r.value), 0);
      res.json({ success: true, trends: rows, total });
    } catch (err) { next(err); }
  },
};
