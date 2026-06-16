import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTripById } from '../services/tripService'
import { generateItinerary, getItinerary } from '../services/aiService'
import { getExpenses, getSplitSummary } from '../services/expenseService'
import { getWeather } from '../services/weatherService'
import InviteModal from '../components/InviteModal'
import ItineraryView from '../components/ItineraryView'
import AddExpenseModal from '../components/AddExpenseModal'
import ExpensesView from '../components/ExpensesView'
import WeatherWidget from '../components/WeatherWidget'
import TripMap from '../components/TripMap'
import { useSocket } from '../context/SocketContext'
import '../styles/pages/TripDetails.css'

function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const [generatingAI, setGeneratingAI] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [splitSummary, setSplitSummary] = useState(null)
  const [weather, setWeather] = useState(null)
  const socket = useSocket()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getTripById(id)
        setTrip(data.trip)

        // Fetch weather using destination
        try {
          const weatherData = await getWeather(data.trip.destination)
          setWeather(weatherData)
        } catch { }

        try {
          const itinData = await getItinerary(id)
          setItinerary(itinData.itinerary)
        } catch { }

        const expenseData = await getExpenses(id)
        setExpenses(expenseData.expenses)

        const splitData = await getSplitSummary(id)
        setSplitSummary(splitData)

      } catch (err) {
        console.error(err)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  useEffect(() => {
  if (!socket || !id) return

  // Join this trip's room
  socket.emit('join_trip', id)

  // Listen for new expenses
  socket.on('expense_added', (newExpense) => {
    setExpenses(prev => [newExpense, ...prev])
    getSplitSummary(id).then(data => setSplitSummary(data))
  })

  // Listen for new members
  socket.on('member_joined', (data) => {
    setTrip(prev => ({
      ...prev,
      members: [...prev.members, data.member]
    }))
  })

  return () => {
    socket.emit('leave_trip', id)
    socket.off('expense_added')
    socket.off('member_joined')
  }
  }, [socket, id])

  const handleGenerateItinerary = async () => {
    setGeneratingAI(true)
    try {
      const data = await generateItinerary(id)
      setItinerary(data.itinerary)
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleExpenseAdded = async (newExpense) => {
    // setExpenses(prev => [newExpense, ...prev])
    const splitData = await getSplitSummary(id)
    setSplitSummary(splitData)
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
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

        <div className="trip-details-back" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </div>

        <div className="trip-details-header">
          <div>
            <div className="trip-details-title">{trip.name}</div>
            <div className="trip-details-destination">{trip.destination}</div>
          </div>
          <button className="btn-invite" onClick={() => setShowInviteModal(true)}>
            + Invite Members
          </button>
        </div>

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
            <div className="trip-info-value">
              ₹{trip.budget.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="section-block">
          <div className="section-block-title">
            <span>📍 Destination Map</span>
          </div>
          <TripMap destination={trip.destination} />
        </div>

        {/* Weather */}
        {weather && (
          <div className="section-block">
            <div className="section-block-title">
              <span>Weather Forecast</span>
            </div>
            <WeatherWidget weather={weather} />
          </div>
        )}

        {/* Members */}
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

        {/* Itinerary */}
        <div className="section-block">
          <div className="section-block-title">
            <span>Itinerary</span>
            <button
              className="btn-invite"
              onClick={handleGenerateItinerary}
              disabled={generatingAI}
            >
              {generatingAI ? 'Generating...' : itinerary ? 'Regenerate' : 'Generate with AI'}
            </button>
          </div>
          {generatingAI ? (
            <div className="empty-section">🤖 AI is generating your itinerary...</div>
          ) : itinerary ? (
            <ItineraryView itinerary={itinerary} />
          ) : (
            <div className="empty-section">
              No itinerary yet. Click "Generate with AI" to create one.
            </div>
          )}
        </div>

        {/* Expenses */}
        <div className="section-block">
          <div className="section-block-title">
            <span>Expenses</span>
            <button className="btn-invite" onClick={() => setShowExpenseModal(true)}>
              + Add Expense
            </button>
          </div>
          <ExpensesView expenses={expenses} splitSummary={splitSummary} />
        </div>

      </div>

      {showInviteModal && (
        <InviteModal
          tripId={trip.id}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {showExpenseModal && (
        <AddExpenseModal
          tripId={trip.id}
          onClose={() => setShowExpenseModal(false)}
          onExpenseAdded={handleExpenseAdded}
        />
      )}

    </div>
  )
}

export default TripDetails