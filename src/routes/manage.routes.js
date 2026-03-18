import { Router } from "express";
import * as manageController from '../controllers/manage.controller.js'
import verifyToken from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/requireRole.middleware.js";
const router = Router()
router.get('/users',verifyToken,requireRole(['admin','mod']),manageController.getusers)
router.get('/analytics',verifyToken,requireRole(['admin','teacher','mod']),manageController.getanalytics)
export default router