import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/invitations'

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export const sendInvitation = async (tripId, email) => {
  const response = await axios.post(
    `${BASE_URL}/trips/${tripId}/invite`,
    { email },
    getAuthHeader()
  )
  return response.data
}

export const getPendingInvitations = async () => {
  const response = await axios.get(`${BASE_URL}/pending`, getAuthHeader())
  return response.data
}

export const acceptInvitation = async (invitationId) => {
  const response = await axios.post(
    `${BASE_URL}/${invitationId}/accept`,
    {},
    getAuthHeader()
  )
  return response.data
}

export const declineInvitation = async (invitationId) => {
  const response = await axios.post(
    `${BASE_URL}/${invitationId}/decline`,
    {},
    getAuthHeader()
  )
  return response.data
}