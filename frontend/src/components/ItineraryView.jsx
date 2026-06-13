import '../styles/components/ItineraryView.css'

function ItineraryView({ itinerary }) {
  return (
    <div className="itinerary">

      {/* Days */}
      {itinerary.days.map((day) => (
        <div className="itinerary-day" key={day.day}>
          <div className="itinerary-day-header">
            <div className="day-number">Day {day.day}</div>
            <div className="day-title">{day.title}</div>
          </div>

          <div className="activities">
            {day.activities.map((activity, index) => (
              <div className="activity" key={index}>
                <div className="activity-time">{activity.time}</div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-desc">{activity.description}</div>
                  {activity.estimatedCost > 0 && (
                    <div className="activity-cost">
                      ₹{activity.estimatedCost.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tips */}
      {itinerary.tips && itinerary.tips.length > 0 && (
        <div className="itinerary-tips">
          <div className="tips-title">💡 Travel Tips</div>
          {itinerary.tips.map((tip, index) => (
            <div className="tip-item" key={index}>• {tip}</div>
          ))}
        </div>
      )}

      {/* Estimated Cost */}
      <div className="itinerary-total">
        <span>Estimated Total Cost</span>
        <span className="total-amount">
          ₹{itinerary.estimatedTotalCost?.toLocaleString('en-IN')}
        </span>
      </div>

    </div>
  )
}

export default ItineraryView