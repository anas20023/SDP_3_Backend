import express from 'express'
import { configDotenv } from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './src/routes/index.js'
const app=express()
configDotenv()
const PORT =process.env.PORT | 3000

app.use(bodyParser.json())
app.use(cors())

app.use('/api',router)

app.listen(PORT,()=>{
   console.log(`Backend running on port ${PORT}`)
})