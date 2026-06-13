import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyTrips } from '../services/tripService'
import { getPendingInvitations, acceptInvitation, declineInvitation } from '../services/invitationService'
import TripCard from '../components/TripCard'
import '../styles/pages/Dashboard.css'

function Dashboard() {
  const [trips, setTrips] = useState([])
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsData, invitesData] = await Promise.all([
          getMyTrips(),
          getPendingInvitations()
        ])
        setTrips(tripsData.trips)
        setInvitations(invitesData.invitations)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAccept = async (invitationId) => {
    try {
      await acceptInvitation(invitationId)
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      const data = await getMyTrips()
      setTrips(data.trips)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecline = async (invitationId) => {
    try {
      await declineInvitation(invitationId)
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const now = new Date()
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) >= now)
  const pastTrips = trips.filter(trip => new Date(trip.startDate) < now)

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✈</div>
          <span className="sidebar-brand-name">Wandr</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active">🗺 My Trips</div>
          <div className="sidebar-item" onClick={() => navigate('/create-trip')}>➕ Create Trip</div>
          <div className="sidebar-item">💰 Expenses</div>
          <div className="sidebar-item">🔔 Notifications</div>
          <div className="sidebar-item">👤 Profile</div>
          <div className="sidebar-item" onClick={handleLogout}>🚪 Logout</div>
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

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome back, {user?.firstName}</h1>
            <p>You have {upcomingTrips.length} upcoming trips</p>
          </div>
          <button className="btn-create-trip" onClick={() => navigate('/create-trip')}>
            + Create trip
          </button>
        </div>

        {/* Pending Invitations */}
        {invitations.map(inv => (
          <div className="invitation-banner" key={inv.id}>
            <div className="invitation-text">
              <strong>{inv.sender.firstName}</strong> invited you to{' '}
              <strong>{inv.trip.name}</strong>
            </div>
            <div className="invitation-actions">
              <button className="btn-decline" onClick={() => handleDecline(inv.id)}>
                Decline
              </button>
              <button className="btn-accept" onClick={() => handleAccept(inv.id)}>
                Accept
              </button>
            </div>
          </div>
        ))}

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total trips</div>
            <div className="stat-value">{trips.length}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Upcoming trips</div>
            <div className="stat-value">{upcomingTrips.length}</div>
            <div className="stat-sub">
              {upcomingTrips.length > 0
                ? `Next: ${new Date(upcomingTrips[0].startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                : 'No upcoming trips'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total budget</div>
            <div className="stat-value">
              ₹{trips.reduce((sum, t) => sum + t.budget, 0).toLocaleString('en-IN')}
            </div>
            <div className="stat-sub">Across all trips</div>
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">Upcoming trips</span>
          <span className="section-view-all">View all</span>
        </div>

        {loading ? (
          <p style={{ color: '#888', fontSize: '14px' }}>Loading trips...</p>
        ) : upcomingTrips.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming trips yet.</p>
            <button className="btn-submit" onClick={() => navigate('/create-trip')}>
              Create your first trip
            </button>
          </div>
        ) : (
          <div className="trips-grid">
            {upcomingTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} type="upcoming" />
            ))}
          </div>
        )}

        {pastTrips.length > 0 && (
          <>
            <div className="section-header" style={{ marginTop: '2rem' }}>
              <span className="section-title">Past trips</span>
              <span className="section-view-all">View all</span>
            </div>
            <div className="trips-grid">
              {pastTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} type="past" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard