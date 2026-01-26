import { Router } from 'express';
import {
  createComment,
  getProjectComments,
  updateComment,
  deleteComment,
  validateCreateComment,
  validateUpdateComment,
} from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/project/:projectId', authenticate, getProjectComments);
router.post('/project/:projectId', authenticate, validateCreateComment, createComment);
router.put('/:commentId', authenticate, validateUpdateComment, updateComment);
router.delete('/:commentId', authenticate, deleteComment);

export default router;
