import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTripById } from '../services/tripService'
import '../styles/pages/TripDetails.css'

function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTripById(id)
        setTrip(data.trip)
      } catch (err) {
        console.error('Failed to fetch trip', err)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [id])

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  if (loading) return (
    <div style={{ color: '#888', padding: '2rem', background: '#1a1a1a', height: '100vh' }}>
      Loading trip...
    </div>
  )

  if (!trip) return null

  return (
    <div className="trip-details-page">
      <div className="trip-details-main">

        {/* Back button */}
        <div className="trip-details-back" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </div>

        {/* Header */}
        <div className="trip-details-header">
          <div>
            <div className="trip-details-title">{trip.name}</div>
            <div className="trip-details-destination">{trip.destination}</div>
          </div>
          <button className="btn-invite">+ Invite Members</button>
        </div>

        {/* Trip Info Row */}
        <div className="trip-info-row">
          <div className="trip-info-card">
            <div className="trip-info-label">Start Date</div>
            <div className="trip-info-value">{formatDate(trip.startDate)}</div>
          </div>
          <div className="trip-info-card">
            <div className="trip-info-label">End Date</div>
            <div className="trip-info-value">{formatDate(trip.endDate)}</div>
          </div>
          <div className="trip-info-card">
            <div className="trip-info-label">Budget</div>
            <div className="trip-info-value">₹{trip.budget.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Members Section */}
        <div className="section-block">
          <div className="section-block-title">
            <span>Members ({trip.members.length})</span>
          </div>
          {trip.members.map((member) => (
            <div className="member-row" key={member.id}>
              <div className="member-initials">
                {member.user.firstName[0]}{member.user.lastName[0]}
              </div>
              <div>
                <div className="member-name">
                  {member.user.firstName} {member.user.lastName}
                </div>
                <div className="member-email">{member.user.email}</div>
              </div>
              <span className="member-role">{member.role}</span>
            </div>
          ))}
        </div>

        {/* Itinerary Section — AI fills this later */}
        <div className="section-block">
          <div className="section-block-title">
            <span>Itinerary</span>
            <button className="btn-invite">Generate with AI</button>
          </div>
          <div className="empty-section">
            No itinerary yet. Click "Generate with AI" to create one.
          </div>
        </div>

        {/* Expenses Section — Phase 4 */}
        <div className="section-block">
          <div className="section-block-title">
            <span>Expenses</span>
            <button className="btn-invite">+ Add Expense</button>
          </div>
          <div className="empty-section">
            No expenses added yet.
          </div>
        </div>

      </div>
    </div>
  )
}

export default TripDetails