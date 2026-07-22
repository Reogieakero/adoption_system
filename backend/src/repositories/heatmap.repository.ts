import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

export interface RescuePointRow extends RowDataPacket {
  report_id: number;
  latitude: number;
  longitude: number;
  status: string;
  location_area: string;
  species: string;
  submitted_at: string | Date;
}

export interface AdoptionPointRow extends RowDataPacket {
  application_id: number;
  animal_name: string;
  application_date: string | Date;
  latitude: number;
  longitude: number;
  location_area: string;
}

// Mati City geofence bounds
export const MATI_CITY_BOUNDS = {
  south: 6.75,
  north: 7.15,
  west: 126.05,
  east: 126.40,
};

function geofenceClause(alias?: string): string {
  const col = alias ? `${alias}.` : '';
  return `${col}latitude BETWEEN ? AND ? AND ${col}longitude BETWEEN ? AND ?`;
}

const GEOFENCE_PARAMS = [
  MATI_CITY_BOUNDS.south,
  MATI_CITY_BOUNDS.north,
  MATI_CITY_BOUNDS.west,
  MATI_CITY_BOUNDS.east,
];

const RESCUE_POINTS_QUERY = `
  SELECT report_id, latitude, longitude, status, location_area, species, submitted_at
  FROM animal_reports
  WHERE is_valid_for_heatmap = 1
    AND latitude IS NOT NULL AND longitude IS NOT NULL
    AND ${geofenceClause()}
  ORDER BY submitted_at DESC
`;

const ADOPTION_POINTS_QUERY = `
  SELECT
    aa.application_id,
    p.name AS animal_name,
    aa.submitted_at AS application_date,
    ar.latitude,
    ar.longitude,
    ar.location_area
  FROM adoption_applications aa
  JOIN pets p ON p.pet_id = aa.pet_id
  LEFT JOIN animal_reports ar ON ar.resident_id = aa.resident_id AND ar.is_valid_for_heatmap = 1
  WHERE aa.status = 'approved'
    AND ar.latitude IS NOT NULL AND ar.longitude IS NOT NULL
    AND ${geofenceClause('ar')}
  ORDER BY aa.submitted_at DESC
`;

export const heatmapRepository = {
  async findRescuePoints(): Promise<RescuePointRow[]> {
    const [rows] = await pool.query<RescuePointRow[]>(RESCUE_POINTS_QUERY, GEOFENCE_PARAMS);
    return rows;
  },

  async findAdoptionPoints(): Promise<AdoptionPointRow[]> {
    const [rows] = await pool.query<AdoptionPointRow[]>(ADOPTION_POINTS_QUERY, GEOFENCE_PARAMS);
    return rows;
  },
};
