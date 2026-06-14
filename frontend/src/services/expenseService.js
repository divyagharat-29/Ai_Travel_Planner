import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const addExpense = async (tripId, expenseData) => {
  const response = await axios.post(
    `${BASE_URL}/trips/${tripId}/expenses`,
    expenseData,
    getAuthHeader()
  )
  return response.data
}

export const getExpenses = async (tripId) => {
  const response = await axios.get(
    `${BASE_URL}/trips/${tripId}/expenses`,
    getAuthHeader()
  )
  return response.data
}

export const getSplitSummary = async (tripId) => {
  const response = await axios.get(
    `${BASE_URL}/trips/${tripId}/split`,
    getAuthHeader()
  )
  return response.data
}