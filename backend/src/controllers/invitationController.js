import prisma from '../config/prismaClient.js'

// SEND INVITATION
export const sendInvitation = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)
    const senderId = req.user.userId
    const { email } = req.body

    // Find the user being invited
    const receiver = await prisma.user.findUnique({
      where: { email }
    })

    if (!receiver) {
      return res.status(404).json({ message: 'No user found with that email' })
    }

    // Can't invite yourself
    if (receiver.id === senderId) {
      return res.status(400).json({ message: 'You cannot invite yourself' })
    }

    // Check if user is already a member
    const alreadyMember = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId: receiver.id
        }
      }
    })

    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this trip' })
    }

    // Check if invitation already sent
    const alreadyInvited = await prisma.invitation.findUnique({
      where: {
        tripId_receiverId: {
          tripId,
          receiverId: receiver.id
        }
      }
    })

    if (alreadyInvited) {
      return res.status(400).json({ message: 'Invitation already sent to this user' })
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        tripId,
        senderId,
        receiverId: receiver.id,
        status: 'pending'
      },
      include: {
        trip: { select: { name: true } },
        sender: { select: { firstName: true, lastName: true } }
      }
    })

    res.status(201).json({
      message: `Invitation sent to ${receiver.firstName}`,
      invitation
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// GET PENDING INVITATIONS FOR LOGGED IN USER
export const getPendingInvitations = async (req, res) => {
  try {
    const userId = req.user.userId

    const invitations = await prisma.invitation.findMany({
      where: {
        receiverId: userId,
        status: 'pending'
      },
      include: {
        trip: {
          select: {
            id: true,
            name: true,
            destination: true,
            startDate: true,
            endDate: true
          }
        },
        sender: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    res.status(200).json({ invitations })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ACCEPT INVITATION
export const acceptInvitation = async (req, res) => {
  try {
    const invitationId = parseInt(req.params.id)
    const userId = req.user.userId

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    })

    if (!invitation || invitation.receiverId !== userId) {
      return res.status(404).json({ message: 'Invitation not found' })
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation already responded to' })
    }

    // Update invitation status and add user as trip member in one transaction
    await prisma.$transaction([
      prisma.invitation.update({
        where: { id: invitationId },
        data: { status: 'accepted' }
      }),
      prisma.tripMember.create({
        data: {
          tripId: invitation.tripId,
          userId,
          role: 'member'
        }
      })
    ])

    res.status(200).json({ message: 'Invitation accepted successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// DECLINE INVITATION
export const declineInvitation = async (req, res) => {
  try {
    const invitationId = parseInt(req.params.id)
    const userId = req.user.userId

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId }
    })

    if (!invitation || invitation.receiverId !== userId) {
      return res.status(404).json({ message: 'Invitation not found' })
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: 'declined' }
    })

    res.status(200).json({ message: 'Invitation declined' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}