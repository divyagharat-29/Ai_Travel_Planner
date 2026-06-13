import { useState } from 'react'
import { sendInvitation } from '../services/invitationService'
import '../styles/components/InviteModal.css'

function InviteModal({ tripId, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInvite = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const data = await sendInvitation(tripId, email)
      setSuccess(data.message)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Invite Members</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-sub">Enter the email address of the person you want to invite</p>

        <form onSubmit={handleInvite}>
          <div className="modal-field">
            <label className="modal-label">EMAIL ADDRESS</label>
            <input
              className="modal-input"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="modal-error">{error}</p>}
          {success && <p className="modal-success">{success}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-send-invite" disabled={loading}>
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default InviteModal