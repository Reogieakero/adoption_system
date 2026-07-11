import { AppError } from '../errors/AppError';

// Must match MATI_CITY_BOUNDS in repositories/heatmap.repository.ts — kept as
// a separate constant here so this module has no dependency on the heatmap
// feature (this validation is meant to run wherever a rescue report's
// lat/lng is set, independent of the map/heatmap code).
export const MATI_CITY_BOUNDS = {
  south: 6.75,
  north: 7.15,
  west: 126.05,
  east: 126.40,
};

function isWithinMatiBounds(lat: number, lng: number): boolean {
  return (
    lat >= MATI_CITY_BOUNDS.south &&
    lat <= MATI_CITY_BOUNDS.north &&
    lng >= MATI_CITY_BOUNDS.west &&
    lng <= MATI_CITY_BOUNDS.east
  );
}

interface NominatimReverseResponse {
  error?: string;
  category?: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
}

// Point-in-polygon against a hand-maintained coastline is a maintenance
// burden and still approximate. Reverse-geocoding against OpenStreetMap's
// actual coastline data via Nominatim gives a real land/water answer with
// no polygon of our own to keep in sync.
//
// Usage policy: Nominatim's public instance allows ~1 request/sec and
// requires a descriptive User-Agent — fine for validating occasional
// rescue-report submissions, NOT for bulk/high-volume validation. If this
// ever needs to run at higher volume, self-host Nominatim or switch to a
// paid geocoding provider instead of increasing call frequency here.
async function reverseGeocode(lat: number, lng: number): Promise<NominatimReverseResponse> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      // Replace with your own contact info per Nominatim's usage policy:
      // https://operations.osmfoundation.org/policies/nominatim/
      'User-Agent': 'PawConnect-Mati/1.0 (contact: admin@example.com)',
    },
  });

  if (!res.ok) {
    throw new AppError(502, 'Location lookup service is unavailable. Please try again.');
  }

  return res.json() as Promise<NominatimReverseResponse>;
}

const WATER_CATEGORIES = new Set(['water', 'natural']);
const WATER_TYPES = new Set(['water', 'bay', 'strait', 'sea', 'ocean', 'coastline']);

/**
 * Throws an AppError if (lat, lng) is not a land location within Mati City.
 * Call this wherever a rescue report's coordinates are set (create or
 * update), before writing to the database.
 */
export async function assertWithinMatiLand(lat: number, lng: number): Promise<void> {
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new AppError(400, 'Latitude and longitude must be valid numbers.');
  }

  // Cheap check first — rejects anything obviously outside the city without
  // ever calling the external service.
  if (!isWithinMatiBounds(lat, lng)) {
    throw new AppError(400, 'Location must be within Mati City, Davao Oriental.');
  }

  const result = await reverseGeocode(lat, lng);

  if (result.error || !result.address) {
    // Nominatim returns no address for open ocean/sea points.
    throw new AppError(400, 'That location appears to be in open water, not on land in Mati City.');
  }

  if (result.category && WATER_CATEGORIES.has(result.category) && result.type && WATER_TYPES.has(result.type)) {
    throw new AppError(400, 'That location appears to be a body of water (e.g. a bay), not on land.');
  }

  const cityLike = (
    result.address.city ||
    result.address.town ||
    result.address.municipality ||
    result.address.county ||
    ''
  ).toLowerCase();

  if (result.address.country_code !== 'ph' || !cityLike.includes('mati')) {
    throw new AppError(400, 'Location must be within Mati City, Davao Oriental.');
  }
}