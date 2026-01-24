import { Router } from "express";
import authroute from './auth.routes.js'
import suggestionRoutes from './suggestion.routes.js'
const router = Router()

router.get('/', (req, res) => {
    // res.send("Server Running")
    res.json({
        message: "Hello From Backend"
    })
})
router.use('/auth', authroute);
router.use('/suggestions', suggestionRoutes);
export default router