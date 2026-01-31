import { Router } from "express";
import verifyAdmin from '../middlewares/auth.middleware.js';
import * as subscriptionController from '../controllers/subscription.controller.js'
const router = Router()

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API for managing subscriptions
 */

/**
 * @swagger
 * /subsc:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyAdmin, subscriptionController.createSubscription)

/**
 * @swagger
 * /subsc:
 *   patch:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, expired, cancelled]
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/', verifyAdmin, subscriptionController.updateSubscription)

/**
 * @swagger
 * /subsc:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/', verifyAdmin, subscriptionController.deleteSubscription)

/**
 * @swagger
 * /subsc:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized
 */
router.get('/', subscriptionController.getSubscription)

export default router