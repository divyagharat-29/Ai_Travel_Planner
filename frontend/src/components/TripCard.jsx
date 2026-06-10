import '../styles/components/TripCard.css'

function TripCard({ trip, type }) {
  return (
    <div className="trip-card">
      <div className="trip-card-top">
        <div>
          <div className="trip-card-name">{trip.name}</div>
          <div className="trip-card-location">{trip.location}</div>
        </div>
        <span className={`trip-badge ${type}`}>{type === 'upcoming' ? 'Upcoming' : 'Past'}</span>
      </div>
      <div className="trip-card-details">
        <span>{trip.dates}</span>
        <span>{trip.members} members</span>
      </div>
      <div className="trip-card-divider"></div>
      <div className="trip-card-footer">
        <div className="trip-card-budget">
          {type === 'upcoming' ? 'Budget' : 'Spent'}: <span>{trip.budget}</span>
        </div>
        <div className="member-avatars">
          {trip.memberInitials.map((init, i) => (
            <div className="member-avatar" key={i}>{init}</div>
          ))}
          {trip.extra > 0 && (
            <div className="member-avatar extra">+{trip.extra}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripCard