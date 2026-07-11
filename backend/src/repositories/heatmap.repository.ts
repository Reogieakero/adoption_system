import { RowDataPacket } from 'mysql2/promise';
import pool from '../config/db';

export interface RescuePointRow extends RowDataPacket {
  id: string;
  latitude: number;
  longitude: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  barangay: string;
  animal_type: string;
  reported_at: string | Date;
}

export interface AdoptionPointRow extends RowDataPacket {
  application_id: string;
  animal_name: string;
  application_date: string | Date;
  latitude: number;
  longitude: number;
  barangay: string;
}

// This system serves Mati City, Davao Oriental only. Every point plotted on
// the heatmap/pin view is geofenced to this bounding box so stray/bad
// coordinates (or future data from elsewhere) never show up on the map.
// Mati City center is ~6.9500 N, 126.2167 E; the box below gives a generous
// buffer around its ~589 sq km land area.
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
  SELECT id, latitude, longitude, priority, status, barangay, animal_type, reported_at
  FROM rescue_cases
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    AND ${geofenceClause()}
  ORDER BY reported_at DESC
`;

// adoption_applications / adoption_application_profiles have no lat/lng of
// their own (only free-text address fields). As a proxy, we use the
// location where the *adopted* animal was originally rescued, joined via
// rescue_cases.linked_animal_id -> animals.id -> adoption_applications.animal_id.
const ADOPTION_POINTS_QUERY = `
  SELECT
    aa.id AS application_id,
    an.name AS animal_name,
    aa.application_date,
    rc.latitude,
    rc.longitude,
    rc.barangay
  FROM adoption_applications aa
  JOIN animals an ON an.id = aa.animal_id
  JOIN rescue_cases rc ON rc.linked_animal_id = aa.animal_id
  WHERE aa.status = 'Adopted'
    AND rc.latitude IS NOT NULL AND rc.longitude IS NOT NULL
    AND ${geofenceClause('rc')}
  ORDER BY aa.application_date DESC
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