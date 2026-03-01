import { Router } from 'express';
import * as SuggestionController from '../controllers/suggestion.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Public routes (if any) - currently assuming all suggestion actions require login
// Or maybe reading suggestions is public? Let's make reading public, writing private for now as a sensible default, or all private.
// Plan says "Protected Routes: Try to access without token -> Expect 401", so let's make them protected.

/**
 * @swagger
 * tags:
 *   name: Suggestions
 *   description: API for managing course suggestions
 */

/**
 * @swagger
 * /suggestions:
 *   post:
 *     summary: Create a new suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [data]
 *             properties:
 *               data:
 *                 type: string
 *                 description: 'JSON string containing course_code, course_name, dept, exam_type, description, etc.'
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Suggestion created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, upload.single('file'), SuggestionController.createSuggestion);

/**
 * @swagger
 * /suggestions:
 *   get:
 *     summary: Get all suggestions
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       401:
 *         description: Unauthorized
 */
router.get('/',  SuggestionController.getAllSuggestions);

/**
 * @swagger
 * /suggestions/{id}:
 *   get:
 *     summary: Get a suggestion by ID
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Suggestion ID
 *     responses:
 *       200:
 *         description: Suggestion details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', verifyToken, SuggestionController.getSuggestionById);

/**
 * @swagger
 * /suggestions/{id}:
 *   put:
 *     summary: Update a suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Suggestion ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               course_code:
 *                 type: string
 *               course_name:
 *                 type: string
 *               dept:
 *                 type: string
 *               exam_type:
 *                 type: string
 *                 enum: [Midterm, Final]
 *               description:
 *                 type: string
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Suggestion updated successfully
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', verifyToken, upload.single('attachment'), SuggestionController.updateSuggestion);

/**
 * @swagger
 * /suggestions/{id}:
 *   delete:
 *     summary: Delete a suggestion
 *     tags: [Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Suggestion ID
 *     responses:
 *       200:
 *         description: Suggestion deleted successfully
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', verifyToken, SuggestionController.deleteSuggestion);

export default router;
