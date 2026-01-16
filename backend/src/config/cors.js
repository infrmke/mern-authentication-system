import cors from 'cors'

const allowedOrigins = [
  `http://localhost:${process.env.CLIENT_PORT || 5173}`,
  process.env.FRONTEND_URL, // o render irá injetar essa variável
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS!'))
    }
  },
  methods: 'GET,POST,PATCH,DELETE',
  credentials: true,
}

export default cors(corsOptions)
