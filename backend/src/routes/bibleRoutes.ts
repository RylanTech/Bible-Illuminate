import express from 'express';
import { getVerse } from '../controllers/bibleController';

const router = express.Router();

// router.get('/books', getBooks);
router.post('/get-verse', getVerse)

export default router;