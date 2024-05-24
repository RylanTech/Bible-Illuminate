import { Router } from 'express';
import { createClip, deleteClip, editClip, getClip, getClips } from '../controllers/clipController';

const router = Router();

router.get('/:', {});


export default router;