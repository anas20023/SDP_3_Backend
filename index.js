import express from 'express'
import { configDotenv } from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './src/routes/index.js'
import connectDB from './src/config/db.js'
import Logger from './src/services/logger.service.js'
import morganMiddleware from './src/middlewares/logger.middleware.js'
const app = express()
configDotenv()
connectDB();
const PORT = process.env.PORT | 3000

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(morganMiddleware)

app.use('/api', router)

app.listen(PORT, () => {
   Logger.info(`Backend running on port ${PORT}`)
})