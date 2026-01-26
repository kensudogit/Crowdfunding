import { Router } from 'express';
import {
  createPledge,
  getProjectPledges,
  getMyPledges,
  validateCreatePledge,
} from '../controllers/pledgeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my', authenticate, getMyPledges);
router.get('/project/:projectId', authenticate, getProjectPledges);
router.post('/project/:projectId', authenticate, validateCreatePledge, createPledge);

export default router;
