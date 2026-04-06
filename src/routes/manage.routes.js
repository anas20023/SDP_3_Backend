import { Router } from "express";
import * as manageController from '../controllers/manage.controller.js'
import verifyToken from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/requireRole.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Administration
 *   description: Administrative operations for managing users, suggestions, and viewing analytics
 */

// User Management

/**
 * @swagger
 * /manage/users:
 *   get:
 *     summary: Get all users
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', verifyToken, requireRole(['admin', 'mod']), manageController.getusers)

/**
 * @swagger
 * /manage/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/users/:id', verifyToken, requireRole(['admin', 'mod']), manageController.getUserById)

/**
 * @swagger
 * /manage/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin, mod]
 *               dept:
 *                 type: string
 *               intake:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:id', verifyToken, requireRole(['admin']), manageController.updateUser)

/**
 * @swagger
 * /manage/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/users/:id', verifyToken, requireRole(['admin']), manageController.deleteUser)

// Analytics

/**
 * @swagger
 * /manage/analytics:
 *   get:
 *     summary: Get administrative analytics
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics', verifyToken, requireRole(['admin', 'teacher', 'mod']), manageController.getanalytics)

// Suggestion Management

/**
 * @swagger
 * /manage/suggestions:
 *   get:
 *     summary: Get all suggestions (Admin view)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 */
router.get('/suggestions', verifyToken, requireRole(['admin', 'teacher', 'mod']), manageController.getsuggestions)

/**
 * @swagger
 * /manage/suggestions/{id}:
 *   get:
 *     summary: Get suggestion by ID
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suggestion'
 */
router.get('/suggestions/:id', verifyToken, requireRole(['admin', 'teacher', 'mod']), manageController.getSuggestionById)

/**
 * @swagger
 * /manage/suggestions/{id}:
 *   put:
 *     summary: Update suggestion (Admin)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, pending, reject]
 *               course_code:
 *                 type: string
 *               course_name:
 *                 type: string
 *               dept:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Suggestion updated successfully
 */
router.put('/suggestions/:id', verifyToken, requireRole(['admin','teacher', 'mod']), upload.single('file'), manageController.updateSuggestion)

/**
 * @swagger
 * /manage/suggestions/{id}:
 *   delete:
 *     summary: Delete suggestion (Admin)
 *     tags: [Administration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggestion deleted successfully
 */
router.delete('/suggestions/:id', verifyToken, requireRole(['admin', 'teacher','mod']), manageController.deleteSuggestion)

export default router