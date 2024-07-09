import express from 'express';
import { getVerse, getVerses } from '../controllers/bibleController';

const router = express.Router();

router.post('/get-verse', getVerse)
router.post('/get-verses', getVerses)

export default router;