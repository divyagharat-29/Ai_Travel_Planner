import '../styles/components/WeatherWidget.css'

function WeatherWidget({ weather }) {
  return (
    <div className="weather-widget">
      <div className="weather-location">
        📍 {weather.city}, {weather.country}
      </div>
      <div className="weather-forecast">
        {weather.forecast.map((item, index) => (
          <div className="weather-item" key={index}>
            <div className="weather-date">{item.date}</div>
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.description}
            />
            <div className="weather-temp">{item.temp}°C</div>
            <div className="weather-desc">{item.description}</div>
            <div className="weather-meta">
              💧 {item.humidity}% · 💨 {item.windSpeed}m/s
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherWidget