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
import { inject } from '@vercel/analytics';

const resolver= new dns.Resolver()
resolver.getServers(['8.8.8.8', '8.8.4.4']) 
const app = express()
configDotenv()
connectDB();
const PORT = process.env.PORT || 3000

app.use(bodyParser.json()) 
app.use(cookieParser())
const corsOptions = {
  origin: ['https://sdp3.alpha.dpdns.org','https://sdp-3-admin-dashboard.vercel.app','http://localhost:5173','http://localhost:8081'], // allowed origin(s) (no trailing slash)
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

// Swagger UI with Vercel Analytics integration
const swaggerOptions = {
  customSiteTitle: "SDP 3 Backend API",
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"
  ],
  customJsStr: `
    // Vercel Web Analytics initialization
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    
    // Load Vercel Analytics script
    (function() {
      var script = document.createElement('script');
      script.defer = true;
      script.src = '/_vercel/insights/script.js';
      document.head.appendChild(script);
    })();
  `,
  swaggerOptions: {
    persistAuthorization: true
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Initialize Vercel Analytics for the Express backend
// This enables analytics tracking when the app runs on Vercel
inject({ mode: process.env.NODE_ENV === 'production' ? 'production' : 'development' });


app.listen(PORT, () => {
   Logger.info(`Backend running on port ${PORT}`)
})
