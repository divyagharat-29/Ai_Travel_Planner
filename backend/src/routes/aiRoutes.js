import express from 'express'
import { generateItinerary, getItinerary } from '../controllers/aiController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/trips/:id/generate', authMiddleware, generateItinerary)
router.get('/trips/:id/itinerary', authMiddleware, getItinerary)

export default router