import { ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';
import { CreateLearningModuleInput, UpdateLearningModuleInput } from '../types/learningModule.types';
import { LearningModuleRow, parseDisplayDate } from '../utils/learningModuleMapper';

function buildInsertValues(input: CreateLearningModuleInput) {
  return [
    input.id,
    input.title,
    input.description,
    input.category,
    input.difficulty,
    input.duration,
    input.status,
    input.objectives ?? '',
    input.content ?? '',
    input.videoUrl ?? '',
    input.pdfUrl ?? '',
    input.views ?? 0,
    input.completionRate ?? '0%',
    input.image ?? '',
    parseDisplayDate(input.dateAdded),
    parseDisplayDate(input.lastUpdated),
  ];
}

export const learningModuleRepository = {
  async findAll(): Promise<LearningModuleRow[]> {
    const [rows] = await pool.query<LearningModuleRow[]>(
      'SELECT * FROM learning_modules ORDER BY date_added DESC, title ASC'
    );
    return rows;
  },

  async findById(id: string): Promise<LearningModuleRow | undefined> {
    const [rows] = await pool.query<LearningModuleRow[]>(
      'SELECT * FROM learning_modules WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create(input: CreateLearningModuleInput): Promise<void> {
    await pool.query(
      `INSERT INTO learning_modules (
        id, title, description, category, difficulty, duration, status,
        objectives, content, video_url, pdf_url, views, completion_rate,
        image_url, date_added, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      buildInsertValues(input)
    );
  },

  async upsert(input: CreateLearningModuleInput): Promise<void> {
    await pool.query(
      `INSERT INTO learning_modules (
        id, title, description, category, difficulty, duration, status,
        objectives, content, video_url, pdf_url, views, completion_rate,
        image_url, date_added, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        category = VALUES(category),
        difficulty = VALUES(difficulty),
        duration = VALUES(duration),
        status = VALUES(status),
        objectives = VALUES(objectives),
        content = VALUES(content),
        video_url = VALUES(video_url),
        pdf_url = VALUES(pdf_url),
        views = VALUES(views),
        completion_rate = VALUES(completion_rate),
        image_url = VALUES(image_url),
        date_added = VALUES(date_added),
        last_updated = VALUES(last_updated)`,
      buildInsertValues(input)
    );
  },

  async update(id: string, input: UpdateLearningModuleInput): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const setField = (column: string, value: unknown) => {
      fields.push(`${column} = ?`);
      values.push(value);
    };

    if (input.title !== undefined) setField('title', input.title);
    if (input.description !== undefined) setField('description', input.description);
    if (input.category !== undefined) setField('category', input.category);
    if (input.difficulty !== undefined) setField('difficulty', input.difficulty);
    if (input.duration !== undefined) setField('duration', input.duration);
    if (input.status !== undefined) setField('status', input.status);
    if (input.objectives !== undefined) setField('objectives', input.objectives);
    if (input.content !== undefined) setField('content', input.content);
    if (input.videoUrl !== undefined) setField('video_url', input.videoUrl);
    if (input.pdfUrl !== undefined) setField('pdf_url', input.pdfUrl);
    if (input.views !== undefined) setField('views', input.views);
    if (input.completionRate !== undefined) setField('completion_rate', input.completionRate);
    if (input.image !== undefined) setField('image_url', input.image);
    if (input.dateAdded !== undefined) {
      setField('date_added', parseDisplayDate(input.dateAdded));
    }
    if (input.lastUpdated !== undefined) {
      setField('last_updated', parseDisplayDate(input.lastUpdated));
    }

    if (fields.length === 0) return true;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE learning_modules SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM learning_modules WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async incrementViews(id: string): Promise<void> {
    await pool.query('UPDATE learning_modules SET views = views + 1 WHERE id = ?', [id]);
  },
};