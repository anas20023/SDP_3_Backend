import { Router } from "express";
import authroute from './auth.routes.js'
const router= Router()

router.get('/',(req,res)=>{
    // res.send("Server Running")
    res.json({
        message:"Hello From Backend"
    })
})
router.use('/auth',authroute);
export default router