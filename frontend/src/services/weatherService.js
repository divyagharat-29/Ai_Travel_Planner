import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/weather'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const getWeather = async (destination) => {
  const response = await axios.get(`${BASE_URL}/${destination}`, getAuthHeader())
  return response.data
}