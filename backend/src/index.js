import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import invitationRoutes from './routes/invitationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/invitations', invitationRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/weather', weatherRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Wandr API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})