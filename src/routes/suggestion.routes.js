import { Router } from 'express';
import * as SuggestionController from '../controllers/suggestion.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Public routes (if any) - currently assuming all suggestion actions require login
// Or maybe reading suggestions is public? Let's make reading public, writing private for now as a sensible default, or all private.
// Plan says "Protected Routes: Try to access without token -> Expect 401", so let's make them protected.

router.post('/', verifyToken, upload.single('attachment'), SuggestionController.createSuggestion);
router.get('/', verifyToken, SuggestionController.getAllSuggestions); // Maybe allow viewing without login? Let's keep it open for now or add verifyToken if needed.
router.get('/:id', verifyToken, SuggestionController.getSuggestionById);
router.put('/:id', verifyToken, upload.single('attachment'), SuggestionController.updateSuggestion);
router.delete('/:id', verifyToken, SuggestionController.deleteSuggestion);

export default router;
