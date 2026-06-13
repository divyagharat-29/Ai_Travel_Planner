import Groq from 'groq-sdk'
import prisma from '../config/prismaClient.js'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export const generateItinerary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)
    const userId = req.user.userId

    // Fetch trip details
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { members: true }
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    // Check user is a member
    const isMember = trip.members.some(m => m.userId === userId)
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Calculate number of days
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    // Build prompt
    const prompt = `
      Generate a detailed ${days}-day travel itinerary for a group trip.
      
      Trip Details:
      - Destination: ${trip.destination}
      - Duration: ${days} days
      - Number of travelers: ${trip.members.length}
      - Total budget: ₹${trip.budget}
      - Budget per person: ₹${Math.round(trip.budget / trip.members.length)}

      Return ONLY a valid JSON object in this exact format, no extra text, no markdown:
      {
        "days": [
          {
            "day": 1,
            "title": "Arrival & Exploration",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Activity name",
                "description": "Brief description",
                "estimatedCost": 500
              }
            ]
          }
        ],
        "tips": ["tip1", "tip2", "tip3"],
        "estimatedTotalCost": 40000
      }
    `

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert. Always respond with valid JSON only, no extra text or markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    // Extract and parse response
    const text = completion.choices[0].message.content
    const cleaned = text.replace(/```json|```/g, '').trim()
    const itineraryData = JSON.parse(cleaned)

    // Save to database using upsert
    const itinerary = await prisma.itinerary.upsert({
      where: { tripId },
      update: { content: itineraryData },
      create: { tripId, content: itineraryData }
    })

    res.status(200).json({
      message: 'Itinerary generated successfully',
      itinerary: itinerary.content
    })

  } catch (error) {
    console.error('FULL ERROR:', error.message)
    res.status(500).json({ message: 'Failed to generate itinerary', error: error.message })
  }
}

export const getItinerary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id)

    const itinerary = await prisma.itinerary.findUnique({
      where: { tripId }
    })

    if (!itinerary) {
      return res.status(404).json({ message: 'No itinerary found for this trip' })
    }

    res.status(200).json({ itinerary: itinerary.content })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}