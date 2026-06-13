import { useNavigate } from 'react-router-dom'
import '../styles/components/TripCard.css'

function TripCard({ trip, type }) {
  const navigate = useNavigate()

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const memberInitials = trip.members?.slice(0, 3).map(m =>
    `${m.user.firstName[0]}${m.user.lastName[0]}`
  ) || []

  const extraMembers = trip.members?.length > 3 ? trip.members.length - 3 : 0

  return (
    <div className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
      <div className="trip-card-top">
        <div>
          <div className="trip-card-name">{trip.name}</div>
          <div className="trip-card-location">{trip.destination}</div>
        </div>
        <span className={`trip-badge ${type}`}>
          {type === 'upcoming' ? 'Upcoming' : 'Past'}
        </span>
      </div>

      <div className="trip-card-details">
        <span>{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
        <span>{trip.members?.length || 1} members</span>
      </div>

      <div className="trip-card-divider"></div>

      <div className="trip-card-footer">
        <div className="trip-card-budget">
          Budget: <span>₹{trip.budget.toLocaleString('en-IN')}</span>
        </div>
        <div className="member-avatars">
          {memberInitials.map((init, i) => (
            <div className="member-avatar" key={i}>{init}</div>
          ))}
          {extraMembers > 0 && (
            <div className="member-avatar extra">+{extraMembers}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripCard