import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import invitationRoutes from './routes/invitationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// Attach io to every request so controllers can use it
app.use((req, res, next) => {
  req.io = io
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/invitations', invitationRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api', expenseRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Wandr API is running!' })
})

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // User joins a trip room
  socket.on('join_trip', (tripId) => {
    socket.join(`trip_${tripId}`)
    console.log(`Socket ${socket.id} joined trip_${tripId}`)
  })

  // User leaves a trip room
  socket.on('leave_trip', (tripId) => {
    socket.leave(`trip_${tripId}`)
    console.log(`Socket ${socket.id} left trip_${tripId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})