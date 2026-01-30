import { Router } from "express";
import verifyAdmin from '../middlewares/auth.middleware.js';
import * as subscriptionController from '../controllers/subscription.controller.js'
const router=Router()

router.post('/',verifyAdmin, subscriptionController.createSubscription)  
router.patch('/',verifyAdmin, subscriptionController.updateSubscription)  
router.delete('/',verifyAdmin, subscriptionController.deleteSubscription)  
router.get('/', subscriptionController.getSubscription)  

export default router