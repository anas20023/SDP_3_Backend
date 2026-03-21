import express from 'express'
import { configDotenv } from 'dotenv'
import dns from 'dns'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './src/routes/index.js'
import connectDB from './src/config/db.js'
import Logger from './src/services/logger.service.js'
import morganMiddleware from './src/middlewares/logger.middleware.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
const resolver= new dns.Resolver()
resolver.getServers(['8.8.8.8', '8.8.4.4']) 
const app = express()
configDotenv()
connectDB();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json()) 
app.use(cookieParser())
const corsOptions = {
  origin: ['https://sdp3.alpha.dpdns.org','https://sdp-3-admin-dashboard.vercel.app','http://localhost:5173'], // allowed origin(s) (no trailing slash)
  credentials: true, // This is crucial for allowing cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'], // Specify allowed methods
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ], // Specify allowed headers
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(morganMiddleware)

app.use('/api', router)



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(PORT, () => {
   Logger.info(`Backend running on port ${PORT}`)
})
