import express from 'express';
import { compareTwoTranslationsMultipleVerses, compareTwoTranslationsOneVerse } from '../controllers/geminiController';

const router = express.Router();

router.get("/compare-one/:translationOne/:translationTwo/:book/:chapter/:verse", compareTwoTranslationsOneVerse)
router.get("/compare-many/:translationOne/:translationTwo/:book/:chapter/:verseOne/:verseTwo", compareTwoTranslationsMultipleVerses)

export default router;