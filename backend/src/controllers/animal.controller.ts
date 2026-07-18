import { Request, Response, NextFunction } from 'express';
import { animalService } from '../services/animal.service';
import { CreateAnimalInput, UpdateAnimalInput } from '../types/animal.types';
import { handleServiceError } from '../middleware/authenticateAdmin';
import { toPublicPhotoPath } from '../middleware/upload';

export const animalController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animals = await animalService.listAnimals();
      res.json({ success: true, animals });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animal = await animalService.getAnimalById(req.params.id);
      res.json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateAnimalInput = {
        ...(req.body as CreateAnimalInput),
        photo: req.file ? toPublicPhotoPath(req.file) : '',
      };
      const animal = await animalService.createAnimal(input);
      res.status(201).json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateAnimalInput = { ...(req.body as UpdateAnimalInput) };
      if (req.file) {
        input.photo = toPublicPhotoPath(req.file);
      }
      const animal = await animalService.updateAnimal(req.params.id, input);
      res.json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async generate3D(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const animal = await animalService.generate3DModel(req.params.id);
      res.json({ success: true, animal });
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
      const animal = await animalService.generate3DFromDescription(req.params.id, prompt.trim());
      res.json({ success: true, animal });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await animalService.deleteAnimal(req.params.id);
      res.json({ success: true, message: 'Animal deleted successfully' });
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
};