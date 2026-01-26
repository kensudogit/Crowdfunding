import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMyProjects,
  validateCreateProject,
  validateUpdateProject,
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllProjects);
router.get('/my', authenticate, getMyProjects);
router.get('/:id', getProjectById);
router.post('/', authenticate, validateCreateProject, createProject);
router.put('/:id', authenticate, validateUpdateProject, updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;
