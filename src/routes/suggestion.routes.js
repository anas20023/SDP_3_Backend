import { Router } from 'express';
import * as SuggestionController from '../controllers/suggestion.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { aiRateLimiter } from '../middlewares/rateLimiter.js';

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
 *     description: Authenticated users can create a new course suggestion. A file attachment can be included.
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
 *         description: Suggestion created successfully (Default status is 'pending')
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 *       400:
 *         description: Bad request - Missing required fields or invalid data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.post('/', verifyToken, upload.single('file'), SuggestionController.createSuggestion);

/**
 * @swagger
 * /suggestions:
 *   get:
 *     summary: Get all suggestions
 *     description: Retrieve a list of all course suggestions.
 *     tags: [Suggestions]
 *     responses:
 *       200:
 *         description: List of suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 */
router.get('/',aiRateLimiter, SuggestionController.getAllSuggestions);

/**
 * @swagger
 * /suggestions/{id}:
 *   get:
 *     summary: Get a suggestion by ID
 *     description: Retrieve detailed information about a specific suggestion by its ID.
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
 *         description: Suggestion details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.get('/:id', verifyToken, SuggestionController.getSuggestionById);

/**
 * @swagger
 * /suggestions/{id}:
 *   put:
 *     summary: Update a suggestion
 *     description: >
 *       Update an existing suggestion. 
 *       - Regular users can update their own suggestions (except status).
 *       - Admins can update any suggestion and change its status.
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
 *               status:
 *                 type: string
 *                 enum: [approved, pending, reject]
 *                 description: (Admin ONLY) The new status of the suggestion
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Suggestion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 *       403:
 *         description: Forbidden - Trying to update status as a regular user or updating someone else's suggestion
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.put('/:id', verifyToken, upload.single('file'), SuggestionController.updateSuggestion);

/**
 * @swagger
 * /suggestions/{id}/vote:
 *   post:
 *     summary: Vote for a suggestion
 *     description: >
 *       Allows an authenticated user to star a suggestion. 
 *       - Each user can vote only once per suggestion.
 *       - Votes cannot be undone.
 *       - Increment the stars count.
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
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stars:
 *                   type: number
 *       400:
 *         description: Bad request - User has already voted
 *       404:
 *         description: Suggestion not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 */
router.post('/:id/vote', verifyToken, SuggestionController.voteSuggestion);

/**
 * @swagger
 * /suggestions/{id}:
 *   delete:
 *     summary: Delete a suggestion
 *     description: Permanently delete a suggestion. Only the owner or an admin can delete a suggestion.
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
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Not authorized to delete this suggestion
 */
router.delete('/:id', verifyToken, SuggestionController.deleteSuggestion);

/*
Analyzing using AI
*/
router.post('/ai',aiRateLimiter,verifyToken,SuggestionController.getAiAnalysis)

export default router;
