import { Router } from 'express';
import { generateSampleData } from '../controllers/sampleDataController';

const router = Router();

router.post('/generate', generateSampleData);

export default router;
