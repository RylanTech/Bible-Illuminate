import express from 'express';
import { compareOneTranslationManyVerse, compareOneTranslationOneVerse, compareTwoTranslationsMultipleVerses, compareTwoTranslationsOneVerse } from '../controllers/geminiController';

const router = express.Router();

router.get("/compare-one-verse-two-translations/:translationOne/:translationTwo/:book/:chapter/:verse", compareTwoTranslationsOneVerse)
router.get("/compare-many-verse-two-translations/:translationOne/:translationTwo/:book/:chapter/:verseOne/:verseTwo", compareTwoTranslationsMultipleVerses)

router.get("/compare-one-verse-one-translation/:translationOne/:book/:chapter/:verse", compareOneTranslationOneVerse)
router.get("/compare-many-verse-one-translation/:translationOne/:book/:chapter/:verseOne/:verseTwo", compareOneTranslationManyVerse)

export default router;