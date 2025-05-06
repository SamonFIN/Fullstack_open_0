import axios from "axios"
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'
const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY


const getAll = () => {
  const request = axios.get(allCountriesUrl)
  return request.then(response => response.data)
}

const getWeather = (capital) => {
  const request = axios.get(`${weatherUrl}?q=${capital}&appid=${apiKey}&units=metric`)
  return request.then(response => response.data)
}

export default { getAll, getWeather }