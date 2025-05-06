import { useEffect, useState } from 'react'
import CountryService from '../services/CountryService'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!capital) return

    CountryService
      .getWeather(capital)
      .then(data => {
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          wind: data.wind.speed
        })
      })
      .catch(err => {
        console.error('Failed to fetch weather:', err)
      })
  }, [capital])

  if (!capital) return null

  if (!weather) return <p>Loading weather for {capital}...</p>

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature {weather.temperature} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
      />
      <p>Wind {weather.wind} m/s</p>
    </div>
  )
}

export default Weather