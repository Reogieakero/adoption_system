import fs from 'fs';
import path from 'path';
import { AppError } from '../errors/AppError';
import { animalRepository } from '../repositories/animal.repository';
import { Animal, CreateAnimalInput, UpdateAnimalInput } from '../types/animal.types';
import { rowToAnimal } from '../utils/animalMapper';

const REQUIRED_CREATE_FIELDS: (keyof CreateAnimalInput)[] = [
  'id',
  'name',
  'species',
  'breed',
  'sex',
  'age',
  'size',
  'colorMarkings',
  'rescueStatus',
  'adoptionStatus',
  'healthStatus',
  'vaccinationStatus',
  'heartRate',
  'location',
  'dateAdded',
  'lastUpdated',
  'bio',
];

function validateCreateInput(input: CreateAnimalInput): void {
  for (const field of REQUIRED_CREATE_FIELDS) {
    const value = input[field];
    if (value === undefined || value === null || value === '') {
      throw new AppError(400, `Field "${field}" is required`);
    }
  }
}

export const animalService = {
  async listAnimals(): Promise<Animal[]> {
    const rows = await animalRepository.findAll();
    return rows.map(rowToAnimal);
  },

  async getAnimalById(id: string): Promise<Animal> {
    const row = await animalRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Animal not found');
    }
    return rowToAnimal(row);
  },

  async createAnimal(input: CreateAnimalInput): Promise<Animal> {
    validateCreateInput(input);

    const existing = await animalRepository.findById(input.id);
    if (existing) {
      throw new AppError(409, 'An animal with this ID already exists');
    }

    await animalRepository.create({ ...input, photo: input.photo ?? '' });
    return this.getAnimalById(input.id);
  },

  async updateAnimal(id: string, input: UpdateAnimalInput): Promise<Animal> {
    const existing = await animalRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Animal not found');
    }

    const updated = await animalRepository.update(id, input);
    if (!updated) {
      throw new AppError(400, 'No valid fields provided for update');
    }

    return this.getAnimalById(id);
  },

  async deleteAnimal(id: string): Promise<void> {
    const deleted = await animalRepository.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Animal not found');
    }
  },

  async generate3DModel(id: string): Promise<Animal> {
    const row = await animalRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Animal not found');
    }
    if (!row.photo_url) {
      throw new AppError(400, 'Animal must have a photo before generating a 3D model');
    }

    let imageBuffer: Buffer;
    if (row.photo_url.startsWith('http')) {
      const imgRes = await fetch(row.photo_url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdoptionApp/1.0)' },
      });
      if (!imgRes.ok) throw new Error(`Failed to fetch photo: ${imgRes.status}`);
      imageBuffer = Buffer.from(await imgRes.arrayBuffer());
    } else {
      const photoPath = path.join(__dirname, '../../uploads/animals', path.basename(row.photo_url));
      if (!fs.existsSync(photoPath)) {
        throw new AppError(400, 'Animal photo file not found on server');
      }
      imageBuffer = fs.readFileSync(photoPath);
    }

    return this.runTripoSR(id, imageBuffer);
  },

  async generate3DFromDescription(id: string, prompt: string): Promise<Animal> {
    const row = await animalRepository.findById(id);
    if (!row) {
      throw new AppError(404, 'Animal not found');
    }

    return this.runHunyuan3D(id, prompt);
  },

  async runTripoSR(id: string, imageBuffer: Buffer): Promise<Animal> {
    await animalRepository.updateModel3dStatus(id, 'pending', null);

    const hfToken = process.env.HF_API_TOKEN;
    if (!hfToken) {
      await animalRepository.updateModel3dStatus(id, 'failed', null);
      throw new AppError(500, 'HF_API_TOKEN not configured');
    }

    const space = 'https://stabilityai-TripoSR.hf.space';

    async function queueCall<T>(fnIndex: number, data: unknown[]): Promise<T> {
      const sess = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const joinRes = await fetch(`${space}/queue/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fn_index: fnIndex, data, session_hash: sess, action: 'predict' }),
      });
      if (!joinRes.ok) {
        const err = await joinRes.text();
        throw new Error(`queue/join (fn=${fnIndex}): ${err.slice(0, 200)}`);
      }

      const sseRes = await fetch(`${space}/queue/data?session_hash=${sess}`, {
        headers: { Accept: 'text/event-stream' },
        signal: AbortSignal.timeout(180_000),
      });
      if (!sseRes.ok || !sseRes.body) throw new Error(`SSE (fn=${fnIndex}): ${sseRes.status}`);

      const reader = sseRes.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (t.startsWith('data: ')) {
            try {
              const ev = JSON.parse(t.slice(6));
              if (ev.msg === 'process_completed') {
                if (!ev.success) throw new Error(`Gradio fn=${fnIndex} failed`);
                return ev.output.data as T;
              }
            } catch (e) {
              if (e instanceof Error && e.message.startsWith('Gradio')) throw e;
            }
          }
        }
      }
      throw new Error(`SSE ended without result for fn=${fnIndex}`);
    }

    try {
      const formData = new FormData();
      formData.append('files', new Blob([imageBuffer], { type: 'image/jpeg' }), 'photo.jpg');
      const uploadRes = await fetch(`${space}/upload`, { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error(`Upload to Space failed: ${uploadRes.status}`);
      const [uploadedPath] = await uploadRes.json() as [string];

      const [processedFile] = await queueCall<[{ path: string; url: string }]>(2, [
        { path: uploadedPath },
        false,
        0.9,
      ]);

      const [, glbFile] = await queueCall<[unknown, { path: string; url: string }]>(3, [
        processedFile,
        512,
      ]);

      const glbUrl = glbFile.url || `${space}/file=${glbFile.path}`;
      const glbRes = await fetch(glbUrl);
      if (!glbRes.ok) throw new Error(`Failed to download GLB: ${glbRes.status}`);
      const glbBuffer = Buffer.from(await glbRes.arrayBuffer());

      const ext = '.glb';
      const filename = `3d-${id}-${Date.now()}${ext}`;
      const uploadDir = path.join(__dirname, '../../uploads/models');
      fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, glbBuffer);

      const port = process.env.PORT || 5000;
      const modelUrl = `http://localhost:${port}/uploads/models/${filename}`;
      await animalRepository.updateModel3dStatus(id, 'ready', modelUrl);
    } catch (err) {
      await animalRepository.updateModel3dStatus(id, 'failed', null);
      throw new AppError(500, `Failed to generate 3D model: ${(err as Error).message}`);
    }

    return this.getAnimalById(id);
  },

  async runHunyuan3D(id: string, prompt: string): Promise<Animal> {
    await animalRepository.updateModel3dStatus(id, 'pending', null);

    const hfToken = process.env.HF_API_TOKEN;
    if (!hfToken) {
      await animalRepository.updateModel3dStatus(id, 'failed', null);
      throw new AppError(500, 'HF_API_TOKEN not configured');
    }

    const t2iSpace = 'https://stabilityai-stable-diffusion-3-5-medium.hf.space';

    async function callGradioSSE<T>(apiName: string, data: unknown[]): Promise<T> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hfToken}`,
      };

      const postRes = await fetch(`${t2iSpace}/gradio_api/call/${apiName}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data }),
        signal: AbortSignal.timeout(180_000),
      });
      if (!postRes.ok) throw new Error(`Gradio /call/${apiName}: ${postRes.status}`);

      const ct = postRes.headers.get('content-type') || '';
      let sseRes: Response;

      if (ct.includes('application/json')) {
        const { event_id } = await postRes.json() as { event_id: string };
        if (!event_id) throw new Error(`Gradio /call/${apiName}: no event_id in JSON response`);
        sseRes = await fetch(`${t2iSpace}/gradio_api/call/${apiName}/${event_id}`, {
          headers: { Authorization: `Bearer ${hfToken}` },
          signal: AbortSignal.timeout(180_000),
        });
        if (!sseRes.ok) throw new Error(`Gradio /call/${apiName}/${event_id}: ${sseRes.status}`);
      } else {
        sseRes = postRes;
      }

      if (!sseRes.body) throw new Error(`Gradio /call/${apiName}: no body`);

      const reader = sseRes.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (t.startsWith('event: ')) {
            currentEvent = t.slice(7).trim();
          } else if (t.startsWith('data: ')) {
            try {
              const ev = JSON.parse(t.slice(6));
              const eventType = currentEvent || ev.event;
              if (eventType === 'complete') {
                return (ev.output?.data ?? ev) as T;
              }
              if (eventType === 'error') {
                throw new Error(`Gradio ${apiName} error: ${JSON.stringify(ev).slice(0, 500)}`);
              }
            } catch (e) {
              if (e instanceof Error && e.message.startsWith('Gradio')) throw e;
            }
          }
        }
      }
      throw new Error(`Gradio SSE ended without complete for ${apiName}`);
    }

    const [imageOutput] = await callGradioSSE<[{ path: string; url: string; is_file: boolean }]>(
      'infer',
      [prompt, '', 0, true, 1024, 1024, 4.5, 40]
    );

    const imgUrl = imageOutput.url || `${t2iSpace}/gradio_api/file=${imageOutput.path}`;
    const imgRes = await fetch(imgUrl, { headers: { Authorization: `Bearer ${hfToken}` } });
    if (!imgRes.ok) throw new Error(`Failed to download generated image: ${imgRes.status}`);
    const imageBuffer = Buffer.from(await imgRes.arrayBuffer());

    return this.runTripoSR(id, imageBuffer);
  },

  async seedAnimals(animals: CreateAnimalInput[]): Promise<number> {
    for (const animal of animals) {
      validateCreateInput(animal);
      await animalRepository.upsert(animal);
    }
    return animals.length;
  },
};