import prisma from '../config/prismaClient.js'

// CREATE TRIP
export const createTrip = async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget } = req.body
    const ownerId = req.user.userId

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget),
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'owner'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      message: 'Trip created successfully',
      trip
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// GET ALL TRIPS FOR LOGGED IN USER
export const getMyTrips = async (req, res) => {
  try {
    const userId = req.user.userId

    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    res.status(200).json({ trips })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}