import express from 'express'
import { addExpense, getExpenses, getSplitSummary } from '../controllers/expenseController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/trips/:id/expenses', authMiddleware, addExpense)
router.get('/trips/:id/expenses', authMiddleware, getExpenses)
router.get('/trips/:id/split', authMiddleware, getSplitSummary)

export default router