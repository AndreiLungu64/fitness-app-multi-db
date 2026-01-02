import { query } from '../db/db.js';

export interface WorkoutPlan {
  id?: number;
  user_id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkoutPlanExercise {
  id?: number;
  workout_plan_id: number;
  exercise_id: number;
  sets?: number;
  reps?: number;
  order_index?: number;
  notes?: string;
  created_at?: Date;
}

export interface WorkoutPlanWithExercises extends WorkoutPlan {
  exercises?: Array<{
    exercise_id: number;
    exercise_name: string;
    muscle_group: string;
    difficulty: string;
    sets: number;
    reps: number;
    order_index: number;
    notes?: string;
  }>;
}

class WorkoutPlansRepository {
  // Get all workout plans
  async getAll(): Promise<WorkoutPlan[]> {
    const result = await query('SELECT * FROM fitapp_workout_plans ORDER BY id ASC');
    return result.rows;
  }

  // Get workout plans by user ID
  async getByUserId(userId: string): Promise<WorkoutPlan[]> {
    const result = await query(
      'SELECT * FROM fitapp_workout_plans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  // Get workout plan by ID
  async getById(id: number): Promise<WorkoutPlan | null> {
    const result = await query('SELECT * FROM fitapp_workout_plans WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
  }

  // Get workout plan with exercises
  async getByIdWithExercises(id: number): Promise<WorkoutPlanWithExercises | null> {
    const plan = await this.getById(id);
    if (!plan) return null;

    const exercisesResult = await query(
      `SELECT 
        wpe.exercise_id,
        wpe.sets,
        wpe.reps,
        wpe.order_index,
        wpe.notes,
        e.name as exercise_name,
        e.muscle_group,
        e.difficulty
      FROM fitapp_workout_plan_exercises wpe
      JOIN fitapp_exercises e ON wpe.exercise_id = e.id
      WHERE wpe.workout_plan_id = $1
      ORDER BY wpe.order_index ASC`,
      [id]
    );

    return {
      ...plan,
      exercises: exercisesResult.rows,
    };
  }

  // Create a new workout plan
  async create(
    workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>
  ): Promise<WorkoutPlan> {
    const result = await query(
      'INSERT INTO fitapp_workout_plans (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [workoutPlan.user_id, workoutPlan.name, workoutPlan.description || null]
    );
    return result.rows[0];
  }

  // Update a workout plan
  async update(id: number, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan | null> {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(updates.name);
      paramIndex++;
    }

    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(updates.description);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return this.getById(id);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE fitapp_workout_plans SET ${updateFields.join(
        ', '
      )} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows.length ? result.rows[0] : null;
  }

  // Delete a workout plan
  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM fitapp_workout_plans WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Add exercise to workout plan
  async addExercise(
    workoutPlanId: number,
    exerciseId: number,
    sets: number = 3,
    reps: number = 10,
    orderIndex: number = 0,
    notes?: string
  ): Promise<WorkoutPlanExercise> {
    const result = await query(
      `INSERT INTO fitapp_workout_plan_exercises 
       (workout_plan_id, exercise_id, sets, reps, order_index, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (workout_plan_id, exercise_id) 
       DO UPDATE SET sets = $3, reps = $4, order_index = $5, notes = $6
       RETURNING *`,
      [workoutPlanId, exerciseId, sets, reps, orderIndex, notes || null]
    );
    return result.rows[0];
  }

  // Remove exercise from workout plan
  async removeExercise(workoutPlanId: number, exerciseId: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM fitapp_workout_plan_exercises WHERE workout_plan_id = $1 AND exercise_id = $2',
      [workoutPlanId, exerciseId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Get all exercises in a workout plan
  async getExercises(workoutPlanId: number): Promise<any[]> {
    const result = await query(
      `SELECT 
        wpe.*,
        e.name,
        e.description,
        e.muscle_group,
        e.difficulty,
        e.equipment,
        e.instructions
      FROM fitapp_workout_plan_exercises wpe
      JOIN fitapp_exercises e ON wpe.exercise_id = e.id
      WHERE wpe.workout_plan_id = $1
      ORDER BY wpe.order_index ASC`,
      [workoutPlanId]
    );
    return result.rows;
  }
}

export default new WorkoutPlansRepository();
