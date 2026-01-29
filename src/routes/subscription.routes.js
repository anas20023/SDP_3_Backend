import { Router } from "express";
import verifyToken from '../middlewares/auth.middleware.js';
import * as subscriptionController from '../controllers/subscription.controller.js'
const router=Router()

router.post('/',verifyToken, subscriptionController.createSubscription) 

export default router