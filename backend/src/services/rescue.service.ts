import { AppError } from '../errors/AppError';
import { rescueRepository } from '../repositories/rescue.repository';
import { PriorityType, RescueCase, RescueStage } from '../types/rescue.types';
import { rowToRescueCase } from '../utils/rescueMapper';

const VALID_STAGES: RescueStage[] = ['New Reports', 'Verified Reports', 'Rescue Operations'];
const VALID_PRIORITIES: PriorityType[] = ['Critical', 'High', 'Medium', 'Low'];

export const rescueService = {
  async listCases(): Promise<RescueCase[]> {
    const { cases, timelineByCase } = await rescueRepository.findAll();
    return cases.map((row) => rowToRescueCase(row, timelineByCase.get(row.id) ?? []));
  },

  async getCaseDetails(id: string): Promise<RescueCase> {
    const { case: row, timeline } = await rescueRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Rescue case not found');
    }
    return rowToRescueCase(row, timeline);
  },

  async updateStage(id: string, stage: RescueStage): Promise<RescueCase> {
    if (!VALID_STAGES.includes(stage)) {
      throw new AppError(400, `Invalid stage "${stage}"`);
    }

    const exists = await rescueRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Rescue case not found');
    }

    await rescueRepository.updateStage(id, stage);
    return this.getCaseDetails(id);
  },

  async updateStatus(id: string, status: string): Promise<RescueCase> {
    const exists = await rescueRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Rescue case not found');
    }

    await rescueRepository.updateStatus(id, status);
    return this.getCaseDetails(id);
  },

  async assignRescuer(
    id: string,
    assignedRescuer: string,
    rescueTeam: string,
    eta?: string
  ): Promise<RescueCase> {
    const exists = await rescueRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Rescue case not found');
    }

    await rescueRepository.assignRescuer(id, assignedRescuer, rescueTeam, eta ?? null);
    return this.getCaseDetails(id);
  },

  async updatePriority(id: string, priority: PriorityType): Promise<RescueCase> {
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new AppError(400, `Invalid priority "${priority}"`);
    }

    const exists = await rescueRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Rescue case not found');
    }

    await rescueRepository.updatePriority(id, priority);
    return this.getCaseDetails(id);
  },

  async updateNotes(id: string, internalNotes: string): Promise<RescueCase> {
    const exists = await rescueRepository.exists(id);
    if (!exists) {
      throw new AppError(404, 'Rescue case not found');
    }

    await rescueRepository.updateInternalNotes(id, internalNotes);
    return this.getCaseDetails(id);
  },
};