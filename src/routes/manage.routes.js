import { Router } from "express";
import * as manageController from '../controllers/manage.controller.js'
import verifyToken from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/requireRole.middleware.js";
const router = Router()
router.get('/users',verifyToken,requireRole('admin'),manageController.getusers)
router.get('/analytics',verifyToken,requireRole('admin'),manageController.getanalytics)
export default router