import { Router } from "express";
import * as feedbackController from '../controllers/feedback.controller.js'
import verifyToken from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/requireRole.middleware.js";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: User feedback management
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Submit new feedback
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - subject
 *               - message
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [bug, feature, content, others]
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
router.post('/',verifyToken, feedbackController.createFeedback)

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get all feedbacks (Admin/Mod only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of feedbacks retrieved successfully
 */
router.get('/', verifyToken, requireRole(['admin', 'mod']), feedbackController.getAllFeedbacks)

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Get feedback by ID (Admin/Mod only)
 *     tags: [Feedback]
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
 *         description: Feedback details retrieved successfully
 */
router.get('/:id', verifyToken, requireRole(['admin', 'mod']), feedbackController.getFeedbackById)

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Update feedback (Admin only)
 *     tags: [Feedback]
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
 *         description: Feedback updated successfully
 */
router.put('/:id', verifyToken, requireRole(['admin']), feedbackController.updateFeedback)

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Delete feedback (Admin/Mod only)
 *     tags: [Feedback]
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
 *         description: Feedback deleted successfully
 */
router.delete('/:id', verifyToken, requireRole(['admin', 'mod']), feedbackController.deleteFeedback)

export default router