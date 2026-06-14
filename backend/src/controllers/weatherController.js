import axios from 'axios'

export const getWeather = async (req, res) => {
  try {
    const { destination } = req.params

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: destination,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
          cnt: 5
        }
      }
    )

    const forecast = response.data.list.map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      }),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }))

    res.status(200).json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast
    })

  } catch (error) {
    console.error('Weather error:', error.message)
    res.status(500).json({ message: 'Failed to fetch weather data' })
  }
}