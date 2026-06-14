import prisma from '../config/prismaClient.js'

// ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)
    const paidById = req.user.userId
    const { title, amount } = req.body

    // Verify user is a member of this trip
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId: paidById }
      }
    })

    if (!member) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        paidById,
        title,
        amount: parseFloat(amount),
        splitType: 'equal'
      },
      include: {
        paidBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Expense added successfully',
      expense
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// GET ALL EXPENSES FOR A TRIP
export const getExpenses = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)
    const userId = req.user.userId

    // Verify user is a member
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId }
      }
    })

    if (!member) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({ expenses })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// GET SPLIT SUMMARY
export const getSplitSummary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)
    const userId = req.user.userId

    // Verify user is a member
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        expenses: {
          include: {
            paidBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const isMember = trip.members.some(m => m.userId === userId)
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const memberCount = trip.members.length
    const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0)
    const sharePerPerson = totalExpenses / memberCount

    // Calculate how much each person paid
    const paid = {}
    trip.members.forEach(m => {
      paid[m.userId] = {
        name: `${m.user.firstName} ${m.user.lastName}`,
        paid: 0
      }
    })

    trip.expenses.forEach(expense => {
      if (paid[expense.paidById]) {
        paid[expense.paidById].paid += expense.amount
      }
    })

    // Calculate balance for each person
    // Positive = they are owed money
    // Negative = they owe money
    const balances = Object.entries(paid).map(([userId, data]) => ({
      userId: parseInt(userId),
      name: data.name,
      paid: data.paid,
      share: sharePerPerson,
      balance: data.paid - sharePerPerson
    }))

    // Calculate who owes who
    const settlements = []
    const debtors = balances
      .filter(b => b.balance < 0)
      .sort((a, b) => a.balance - b.balance)

    const creditors = balances
      .filter(b => b.balance > 0)
      .sort((a, b) => b.balance - a.balance)

    let i = 0
    let j = 0

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]
      const amount = Math.min(-debtor.balance, creditor.balance)

      if (amount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount)
        })
      }

      debtor.balance += amount
      creditor.balance -= amount

      if (Math.abs(debtor.balance) < 0.01) i++
      if (Math.abs(creditor.balance) < 0.01) j++
    }

    res.status(200).json({
      totalExpenses,
      sharePerPerson: Math.round(sharePerPerson),
      memberCount,
      balances,
      settlements
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}