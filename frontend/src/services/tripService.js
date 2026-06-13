import axios from 'axios'

const API_URL = 'http://localhost:5000/api/trips'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const createTrip = async (tripData) => {
  const response = await axios.post(API_URL, tripData, getAuthHeader())
  return response.data
}

export const getMyTrips = async () => {
  const response = await axios.get(API_URL, getAuthHeader())
  return response.data
}

export const getTripById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeader())
  return response.data
}