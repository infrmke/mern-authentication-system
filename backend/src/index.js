import express from 'express'
import connectToDb from './config/database.js'

const app = express()
const PORT = process.env.PORT || 3001

connectToDb()

app.listen(PORT, () =>
  console.log(`[SERVER] up and running at http://localhost:${PORT}`)
)
