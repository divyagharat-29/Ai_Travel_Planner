import { useNavigate } from 'react-router-dom'
import TripCard from '../components/TripCard'
import { useEffect } from 'react'
import '../styles/components/TripCard.css'
import '../styles/pages/Dashboard.css'


function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/')
  }
  }, [])

  const user = JSON.parse(localStorage.getItem('user'))

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // Placeholder trip data — will come from API later
  const upcomingTrips = [
    {
      id: 1,
      name: 'Goa Adventure',
      location: 'Goa, India',
      dates: 'Dec 10 – Dec 15, 2025',
      members: 4,
      budget: '₹40,000',
      memberInitials: ['DS', 'RK', 'PA'],
      extra: 1,
    },
    {
      id: 2,
      name: 'Manali Trip',
      location: 'Manali, Himachal Pradesh',
      dates: 'Jan 5 – Jan 10, 2026',
      members: 3,
      budget: '₹25,000',
      memberInitials: ['DS', 'RK', 'AN'],
      extra: 0,
    },
  ]

  const pastTrips = [
    {
      id: 3,
      name: 'Pondicherry Escape',
      location: 'Pondicherry, India',
      dates: 'Oct 2 – Oct 7, 2024',
      members: 3,
      budget: '₹18,000',
      memberInitials: ['DS', 'RK'],
      extra: 1,
    },
  ]

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✈</div>
          <span className="sidebar-brand-name">Wandr</span>
        </div>

        <nav className="sidebar-nav">
  <div className="sidebar-item active">My Trips</div>
  <div className="sidebar-item">Create Trip</div>
  <div className="sidebar-item">Expenses</div>
  <div className="sidebar-item">Notifications</div>
  <div className="sidebar-item">Profile</div>
  <div className="sidebar-item" onClick={handleLogout}>Logout</div>
</nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.firstName} {user?.lastName}</div>
              <div className="sidebar-user-sub">View profile</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome back, {user?.firstName}</h1>
            <p>You have {upcomingTrips.length} upcoming trips</p>
          </div>
          <button className="btn-create-trip" onClick={() => navigate('/create-trip')}>
            ＋ Create trip
          </button>
        </div>

        {/* Invitation Banner — will be dynamic later */}
        <div className="invitation-banner">
          <div className="invitation-text">
            <strong>Rahul</strong> invited you to <strong>Manali Trip</strong>
          </div>
          <div className="invitation-actions">
            <button className="btn-decline">Decline</button>
            <button className="btn-accept">Accept</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total trips</div>
            <div className="stat-value">3</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Upcoming trips</div>
            <div className="stat-value">2</div>
            <div className="stat-sub">Next: Dec 10</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total spent</div>
            <div className="stat-value">₹37,500</div>
            <div className="stat-sub">Across all trips</div>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="section-header">
          <span className="section-title">Upcoming trips</span>
          <span className="section-view-all">View all</span>
        </div>

        <div className="trips-grid">
          {upcomingTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} type="upcoming" />
          ))}
        </div>

        {/* Past Trips */}
        <div className="section-header">
          <span className="section-title">Past trips</span>
          <span className="section-view-all">View all</span>
        </div>

        <div className="trips-grid">
          {pastTrips.map(trip => (
            <div className="trip-card" key={trip.id}>
              <div className="trip-card-top">
                <div>
                  <div className="trip-card-name">{trip.name}</div>
                  <div className="trip-card-location">{trip.location}</div>
                </div>
                <span className="trip-badge past">Past</span>
              </div>
              <div className="trip-card-details">
                <span> {trip.dates}</span>
                <span> {trip.members} members</span>
              </div>
              <div className="trip-card-divider"></div>
              <div className="trip-card-footer">
                <div className="trip-card-budget">Spent: <span>{trip.budget}</span></div>
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
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard