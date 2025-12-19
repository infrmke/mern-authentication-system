import express from 'express'
import cookieParser from 'cookie-parser'

import connectToDb from './config/database.js'
import cors from './config/cors.js'
import { verifyConnection } from './config/nodemailer.js'

import UserRouter from './modules/user/user.route.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.SERVER_PORT || 3001

connectToDb()
verifyConnection() // verifica a conexão do nodemailer

app.use(express.json())
app.use(cors)
app.use(cookieParser())

//  rotas
app.use(UserRouter)

//  middleware para rotas não encontradas (404)
app.use((req, res, next) => {
  const error = new Error('Route not found')
  error.status = 404
  next(error)
})

//  middleware de erro global
app.use(errorHandler)

app.listen(PORT, () =>
  console.log(`[SERVER] up and running at http://localhost:${PORT}`)
)
