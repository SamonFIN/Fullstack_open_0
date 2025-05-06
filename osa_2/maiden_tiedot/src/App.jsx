import { useState, useEffect } from 'react'
import FindForm from './components/FindForm'
import CountryService from './services/CountryService'
import Notification from './components/Notification'
import Countries from './components/Countries'

const TOO_MANY_MATCHES = "Too many matches, specify another filter"
const NO_MATCHES = "No matches found"


function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    CountryService
      .getAll()
      .then(initCountries => {
        setCountries(initCountries)
      })
  }
  , [])

  useEffect(() => {
    const filtered = filterCountries(countries, search)

    const exactMatch = countries.find(
      country => country.name.common.toLowerCase() === search.toLowerCase()
    )
  
    if (exactMatch) {
      setFilteredCountries([exactMatch])
      setNotification(null)
      return
    }
  
    if (filtered.length > 10) {
      setNotification({ message: TOO_MANY_MATCHES, type: 'message' })
      return
    } 

    else if (filtered.length < 1) {
      setNotification({ message: NO_MATCHES, type: 'message' })
      setFilteredCountries(filtered)
      return
    } 

    else {
      setNotification(null)
      setFilteredCountries(filtered)
      return
    }
  }, [countries, search])

  const filterCountries = (countries, search) => {
    if (!search.trim()) return []

    return countries.filter(country => country.name.common.toLowerCase()
    .includes(search.toLowerCase()))
  }

  const handleSearch = (event) => {
    const currentSearch = event.target.value
    setSearch(currentSearch) 
    //console.log(currentSearch)
  }

  const handleShow = (country) => {
    setFilteredCountries([country])
    setSearch(country.name.common)
  }

  return (
    <div>
      <FindForm 
      search={search} 
      handleSearch={handleSearch} />

      <Notification 
        message={notification?.message}
        type={notification?.type} />

      <Countries 
        countries={filteredCountries} 
        handleShow={handleShow} />
    </div>
  )
}

export default App
