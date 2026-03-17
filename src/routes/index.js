import { Router } from "express";
import authroute from './auth.routes.js'
import suggestionRoutes from './suggestion.routes.js'
import subscriptionRoute from './subscription.routes.js'
import manageRoutes from './manage.routes.js'
const router = Router()

router.get('/', (req, res) => {
    // res.send("Server Running")
    res.json({
        message: "Hello From Backend"
    })
})
/// Some changes in the file for git check !
router.use('/auth', authroute);
router.use('/manage',manageRoutes)
router.use('/suggestions', suggestionRoutes);
router.use('/subsc', subscriptionRoute);
export default router