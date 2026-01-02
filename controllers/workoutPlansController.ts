import { Request, Response } from 'express';
import workoutPlansRepository from '../repository/workoutPlansRepository.js';

const getAllWorkoutPlans = async (req: Request, res: Response) => {
  try {
    const workoutPlans = await workoutPlansRepository.getAll();
    res.json(workoutPlans);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWorkoutPlansByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const workoutPlans = await workoutPlansRepository.getByUserId(userId);
    res.json(workoutPlans);
  } catch (error) {
    console.error('Error fetching workout plans by user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWorkoutPlanById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid workout plan ID' });
      return;
    }

    const workoutPlan = await workoutPlansRepository.getByIdWithExercises(id);
    if (!workoutPlan) {
      res.status(404).json({ message: `Workout plan ID ${id} not found` });
      return;
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const { user_id, name, description } = req.body;

    if (!user_id || !name) {
      res.status(400).json({ message: 'User ID and name are required' });
      return;
    }

    const newWorkoutPlan = await workoutPlansRepository.create({
      user_id: user_id,
      name,
      description,
    });

    res.status(201).json(newWorkoutPlan);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid workout plan ID' });
      return;
    }

    const existingPlan = await workoutPlansRepository.getById(id);
    if (!existingPlan) {
      res.status(404).json({ message: `Workout plan ID ${id} not found` });
      return;
    }

    const { name, description } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const updatedPlan = await workoutPlansRepository.update(id, updates);
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid workout plan ID' });
      return;
    }

    const existingPlan = await workoutPlansRepository.getById(id);
    if (!existingPlan) {
      res.status(404).json({ message: `Workout plan ID ${id} not found` });
      return;
    }

    await workoutPlansRepository.delete(id);
    res.json({ message: `Workout plan ID ${id} successfully deleted` });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addExerciseToWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const workoutPlanId = parseInt(req.params.id);
    const { exercise_id, sets, reps, order_index, notes } = req.body;

    if (isNaN(workoutPlanId) || !exercise_id) {
      res.status(400).json({ message: 'Valid workout plan ID and exercise ID are required' });
      return;
    }

    const result = await workoutPlansRepository.addExercise(
      workoutPlanId,
      parseInt(exercise_id),
      sets ? parseInt(sets) : 3,
      reps ? parseInt(reps) : 10,
      order_index ? parseInt(order_index) : 0,
      notes
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding exercise to workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeExerciseFromWorkoutPlan = async (req: Request, res: Response) => {
  try {
    const workoutPlanId = parseInt(req.params.id);
    const exerciseId = parseInt(req.params.exerciseId);

    if (isNaN(workoutPlanId) || isNaN(exerciseId)) {
      res.status(400).json({ message: 'Valid workout plan ID and exercise ID are required' });
      return;
    }

    const success = await workoutPlansRepository.removeExercise(workoutPlanId, exerciseId);
    if (!success) {
      res.status(404).json({ message: 'Exercise not found in workout plan' });
      return;
    }

    res.json({ message: 'Exercise removed from workout plan' });
  } catch (error) {
    console.error('Error removing exercise from workout plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWorkoutPlanExercises = async (req: Request, res: Response) => {
  try {
    const workoutPlanId = parseInt(req.params.id);

    if (isNaN(workoutPlanId)) {
      res.status(400).json({ message: 'Invalid workout plan ID' });
      return;
    }

    const exercises = await workoutPlansRepository.getExercises(workoutPlanId);
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching workout plan exercises:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const workoutPlansController = {
  getAllWorkoutPlans,
  getWorkoutPlansByUserId,
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  addExerciseToWorkoutPlan,
  removeExerciseFromWorkoutPlan,
  getWorkoutPlanExercises,
};

export { workoutPlansController };
