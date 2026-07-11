import { Request, Response, NextFunction } from 'express';
import { assertWithinMatiLand } from '../utils/geoValidation';

/**
 * Validates req.body.latitude / req.body.longitude before letting a
 * create/update request through to the controller. Rejects with 400 if the
 * point is in the sea/a bay, or outside Mati City entirely.
 *
 * Wire it into whichever route(s) accept a rescue report's coordinates, e.g.
 * in rescues.routes.ts:
 *
 *   import { validateMatiLandLocation } from '../middleware/validateMatiLandLocation';
 *   router.post('/', validateMatiLandLocation, rescueController.create);
 *   router.patch('/:id', validateMatiLandLocation, rescueController.update);
 *
 * Only runs when latitude/longitude are present on the request body, so it's
 * safe to add to update routes that don't always touch location.
 */
export async function validateMatiLandLocation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { latitude, longitude } = req.body ?? {};

  if (latitude === undefined && longitude === undefined) {
    next();
    return;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  try {
    await assertWithinMatiLand(lat, lng);
    next();
  } catch (err) {
    next(err);
  }
}