import { useState } from 'react'
import { addExpense } from '../services/expenseService'
import '../styles/components/InviteModal.css'

function AddExpenseModal({ tripId, onClose, onExpenseAdded }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await addExpense(tripId, { title, amount })
      onExpenseAdded(data.expense)
      onClose()
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
          <h2>Add Expense</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-sub">This expense will be split equally among all members</p>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">WHAT WAS IT FOR?</label>
            <input
              className="modal-input"
              type="text"
              placeholder="e.g. Hotel Booking, Dinner, Cab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">AMOUNT (₹)</label>
            <input
              className="modal-input"
              type="number"
              placeholder="e.g. 2000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel-modal" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-send-invite" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default AddExpenseModal