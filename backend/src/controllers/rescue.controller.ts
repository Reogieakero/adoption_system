import { Request, Response, NextFunction } from 'express';
import { rescueService } from '../services/rescue.service';
import {
  AssignRescuerInput,
  UpdateRescueLocationInput,
  UpdateRescueNotesInput,
  UpdateRescuePriorityInput,
  UpdateRescueStageInput,
  UpdateRescueStatusInput,
} from '../types/rescue.types';
import { handleServiceError } from '../middleware/authenticateAdmin';

export const rescueController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cases = await rescueService.listCases();
      res.json({ success: true, cases });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const details = await rescueService.getCaseDetails(req.params.id);
      res.json({ success: true, details });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateStage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stage } = req.body as UpdateRescueStageInput;
      const rescueCase = await rescueService.updateStage(req.params.id, stage);
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body as UpdateRescueStatusInput;
      const rescueCase = await rescueService.updateStatus(req.params.id, status);
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async assignRescuer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { assignedRescuer, rescueTeam, eta } = req.body as AssignRescuerInput;
      const rescueCase = await rescueService.assignRescuer(
        req.params.id,
        assignedRescuer,
        rescueTeam,
        eta
      );
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updatePriority(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { priority } = req.body as UpdateRescuePriorityInput;
      const rescueCase = await rescueService.updatePriority(req.params.id, priority);
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async updateNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { internalNotes } = req.body as UpdateRescueNotesInput;
      const rescueCase = await rescueService.updateNotes(req.params.id, internalNotes);
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  // Lets an admin correct a case's coordinates (e.g. a report that was
  // pinned in the wrong spot). The validateMatiLandLocation middleware on
  // this route already rejected anything in the sea or outside Mati City
  // before this handler ever runs.
  async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { latitude, longitude } = req.body as UpdateRescueLocationInput;
      const rescueCase = await rescueService.updateLocation(
        req.params.id,
        Number(latitude),
        Number(longitude)
      );
      res.json({ success: true, case: rescueCase });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};