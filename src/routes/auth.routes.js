import { Router } from "express";
import * as authcontroller from '../controllers/auth.controller.js' 
const router = Router()

router.post('/register',authcontroller.handleRegister)
router.post('/login',authcontroller.handleLogin)

export default router