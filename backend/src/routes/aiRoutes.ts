import express from 'express';
import { compareMultiple, compareOne } from '../controllers/geminiController';

const router = express.Router();

router.get("/compare-one/:translationOne/:translationTwo/:book/:chapter/:verse", compareOne)
router.get("/compare-many/:translationOne/:translationTwo/:book/:chapter/:verseOne/:verseTwo", compareMultiple)

export default router;