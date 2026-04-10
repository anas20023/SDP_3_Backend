import app from './src/app.js'
import { configDotenv } from 'dotenv'
import dns from 'dns'
import connectDB from './src/config/db.js'
import Logger from './src/services/logger.service.js'

const resolver = new dns.Resolver()
resolver.getServers(['8.8.8.8', '8.8.4.4']) 

configDotenv()
connectDB();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
   Logger.info(`Backend running on port ${PORT}`)
})

