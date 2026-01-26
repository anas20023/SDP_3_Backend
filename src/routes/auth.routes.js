import { Router } from "express";
import * as authcontroller from '../controllers/auth.controller.js'
import verifyToken from "../middlewares/auth.middleware.js";
const router = Router()

router.post('/register', authcontroller.handleRegister)
router.post('/login', authcontroller.handleLogin)
router.get('/me',verifyToken,authcontroller.handleProfile)
router.post('/logout', verifyToken, authcontroller.handleLogout)

export default router