import express from 'express';
import { workoutPlansController } from '../../controllers/workoutPlansController.js';
import verifyJWT from '../../middleware/verifyJWT.js';

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Workout plan routes
router
  .route('/')
  .get(workoutPlansController.getAllWorkoutPlans)
  .post(workoutPlansController.createWorkoutPlan);

router
  .route('/:id')
  .get(workoutPlansController.getWorkoutPlanById)
  .put(workoutPlansController.updateWorkoutPlan)
  .delete(workoutPlansController.deleteWorkoutPlan);

// User-specific workout plans
router.route('/user/:userId').get(workoutPlansController.getWorkoutPlansByUserId);

// Workout plan exercises
router
  .route('/:id/exercises')
  .get(workoutPlansController.getWorkoutPlanExercises)
  .post(workoutPlansController.addExerciseToWorkoutPlan);

router
  .route('/:id/exercises/:exerciseId')
  .delete(workoutPlansController.removeExerciseFromWorkoutPlan);

export default router;
