import express from 'express'
import {
  sendInvitation,
  getPendingInvitations,
  acceptInvitation,
  declineInvitation
} from '../controllers/invitationController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/trips/:id/invite', authMiddleware, sendInvitation)
router.get('/pending', authMiddleware, getPendingInvitations)
router.post('/:id/accept', authMiddleware, acceptInvitation)
router.post('/:id/decline', authMiddleware, declineInvitation)

export default router