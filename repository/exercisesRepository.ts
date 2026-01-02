import { query } from '../db/db.js';

export interface Exercise {
  id?: number;
  name: string;
  description?: string;
  muscle_group: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string;
  instructions?: string;
  created_at?: Date;
}

class ExerciseRepository {
  async getAll(): Promise<Exercise[]> {
    const result = await query('SELECT * FROM fitapp_exercises ORDER BY id ASC');
    return result.rows;
  }

  async getByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const result = await query(
      'SELECT * FROM fitapp_exercises WHERE muscle_group = $1 ORDER BY id ASC',
      [muscleGroup]
    );
    return result.rows;
  }

  async getByDifficulty(difficulty: string): Promise<Exercise[]> {
    const result = await query(
      'SELECT * FROM fitapp_exercises WHERE difficulty = $1 ORDER BY id ASC',
      [difficulty]
    );
    return result.rows;
  }

  async getById(id: number): Promise<Exercise | null> {
    const result = await query('SELECT * FROM fitapp_exercises WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  async create(exercise: Omit<Exercise, 'id' | 'created_at'>): Promise<Exercise> {
    const result = await query(
      'INSERT INTO fitapp_exercises (name, description, muscle_group, difficulty, equipment, instructions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        exercise.name,
        exercise.description || null,
        exercise.muscle_group,
        exercise.difficulty,
        exercise.equipment || null,
        exercise.instructions || null,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, exercise: Partial<Exercise>): Promise<Exercise | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (exercise.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(exercise.name);
      paramIndex++;
    }

    if (exercise.description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(exercise.description);
      paramIndex++;
    }

    if (exercise.muscle_group !== undefined) {
      updates.push(`muscle_group = $${paramIndex}`);
      values.push(exercise.muscle_group);
      paramIndex++;
    }

    if (exercise.difficulty !== undefined) {
      updates.push(`difficulty = $${paramIndex}`);
      values.push(exercise.difficulty);
      paramIndex++;
    }

    if (exercise.equipment !== undefined) {
      updates.push(`equipment = $${paramIndex}`);
      values.push(exercise.equipment);
      paramIndex++;
    }

    if (exercise.instructions !== undefined) {
      updates.push(`instructions = $${paramIndex}`);
      values.push(exercise.instructions);
      paramIndex++;
    }

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);

    const result = await query(
      `UPDATE fitapp_exercises SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows.length ? result.rows[0] : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM fitapp_exercises WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export default new ExerciseRepository();
