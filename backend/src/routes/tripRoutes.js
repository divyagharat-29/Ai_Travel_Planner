import express from 'express'
import { createTrip, getMyTrips, getTripById } from '../controllers/tripController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createTrip)
router.get('/', authMiddleware, getMyTrips)
router.get('/:id', authMiddleware, getTripById)

export default router