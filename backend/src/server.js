import app from './index.js'

const PORT = process.env.SERVER_PORT || 3001

app.listen(PORT, () =>
  console.log(`[SERVER] up and running at http://localhost:${PORT}`)
)
