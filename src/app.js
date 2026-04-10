import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import morganMiddleware from './middlewares/logger.middleware.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { inject } from '@vercel/analytics';

const app = express()

app.use(bodyParser.json()) 
app.use(cookieParser())

const corsOptions = {
  origin: ['https://sdp3.alpha.dpdns.org','https://sdp-3-admin-dashboard.vercel.app','http://localhost:5173','http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morganMiddleware)

app.use('/api', router)

// Swagger UI configuration
const swaggerOptions = {
  customSiteTitle: "SDP 3 Backend API",
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"
  ],
  customJsStr: `
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
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

// Initialize Vercel Analytics
inject({ mode: process.env.NODE_ENV === 'production' ? 'production' : 'development' });

export default app;
