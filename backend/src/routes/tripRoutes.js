import express from 'express'
import { createTrip, getMyTrips } from '../controllers/tripController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createTrip)
router.get('/', authMiddleware, getMyTrips)

export default router