import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/ai'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const generateItinerary = async (tripId) => {
  const response = await axios.post(
    `${BASE_URL}/trips/${tripId}/generate`,
    {},
    getAuthHeader()
  )
  return response.data
}

export const getItinerary = async (tripId) => {
  const response = await axios.get(
    `${BASE_URL}/trips/${tripId}/itinerary`,
    getAuthHeader()
  )
  return response.data
}