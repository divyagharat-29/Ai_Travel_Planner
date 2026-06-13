import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTrip } from '../services/tripService'
import '../styles/pages/CreateTrip.css'

function CreateTrip() {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date')
      return
    }

    setLoading(true)

    try {
      await createTrip({ name, destination, startDate, endDate, budget })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-trip-page">
      <div className="create-trip-main">

        <div className="create-trip-header">
          <h1>Create a new trip</h1>
          <p>Fill in the details and start planning</p>
        </div>

        <form className="create-trip-form" onSubmit={handleSubmit}>

          <div className="form-field">
            <label className="form-label">TRIP NAME</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Goa Adventure"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">DESTINATION</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Goa, India"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">START DATE</label>
              <input
                className="form-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label">END DATE</label>
              <input
                className="form-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">BUDGET (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 40000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create trip'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateTrip