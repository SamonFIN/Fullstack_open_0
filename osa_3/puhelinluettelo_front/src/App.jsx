import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonForm from './components/PersonForm'
import PersonsList from './components/PersonsList'
import FilterForm from './components/FilterForm'
import personService from './services/person_service'
import Notification from './components/Notification'

const T_DUPLICATE_PERSON = "is already added to phonebook, replace the old number with a new one?"
const NOTIFICATION_TIMEOUT = 5000

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initPersons => {
        setPersons(initPersons)
        setFilteredPersons(initPersons)
      })
  }, [])

  useEffect(() => {
    setFilteredPersons(filterPersons(persons, search))
  }, [persons, search])

  const handleNameChange = (event) => {
    //onsole.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleDelete = (id) => {
    const foundPerson = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${foundPerson.name} with id: ${foundPerson.id}?`)) {
      personService
        .remove(id)
        .then(() => {
          const updatedPersons = persons.filter(person => person.id !== id)
          setPersons(updatedPersons)
          setFilteredPersons(filterPersons(updatedPersons, search))
          showNotification(`Deleted ${foundPerson.name}`, 'success')
        })
        .catch(error => { 
          showNotification(`Information of ${foundPerson.name} has already been removed from server`, 'error')
        })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const foundPerson = persons.find(p => p.name === newName)
    let updatedPersons = []

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (foundPerson) {
      if (window.confirm(`${newName} ${T_DUPLICATE_PERSON}`)) {
        personService
          .update(foundPerson.id, personObject)
          .then(returnedPerson => {
            updatedPersons = persons.map(person =>
              person.id !== foundPerson.id ? person : returnedPerson)
              updateAddNew(updatedPersons)
              showNotification(`Updated ${returnedPerson.name}`, 'success')
          })
        }
        return
    }
    else {
      personService
        .add(personObject)
        .then(returnedPerson => {
          updatedPersons = persons.concat(returnedPerson)
          updateAddNew(updatedPersons)
          showNotification(`Added ${returnedPerson.name}`, 'success')
        })
        .catch(error => {
          const errorMessage = error.response?.data?.error || 'Failed to add person'
          showNotification(errorMessage, 'error')
        })
    }
  }

  const updateAddNew = (updatedPersons) => {
    setPersons(updatedPersons)
    setNewName('')
    setNewNumber('')
    setFilteredPersons(filterPersons(updatedPersons, search))
  }

  const showNotification = (
    message,
    type = 'success',
    timeout = NOTIFICATION_TIMEOUT) => 
    {
      setNotification({ message, type })
      setTimeout(() => {
        setNotification(null)
    }, timeout)
  }


  const filterPersons = (persons_list, search) => {
    if (search === '') return persons_list
    return persons_list.filter(person =>
      person.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  const handleSearch = (event) => {
    const search = event.target.value
    setSearch(search)
    setFilteredPersons(filterPersons(persons, search))
  }

  return (
    <div>
        <h2>Phonebook</h2>
        <Notification message={notification?.message} type={notification?.type} />

        <FilterForm 
          search={search}
          handleSearch={handleSearch}
        />

        <h2>add a new</h2>

        <PersonForm 
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={handleSubmit}
        />

        <h2>Numbers</h2>

        <PersonsList 
          persons={filteredPersons}
          handleDelete={handleDelete}
        />

    </div>
  )
}

export default App