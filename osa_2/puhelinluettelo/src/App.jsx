import { useState } from 'react'
import PersonForm from './components/PersonForm'
import PersonsList from './components/PersonsList'
import FilterForm from './components/FilterForm'


const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const handleNameChange = (event) => {
    //onsole.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const updatedPersons = persons.concat(nameObject)
    setPersons(updatedPersons)
    setNewName('')
    setNewNumber('')
    setFilteredPersons(filterPersons(updatedPersons, search))
  }

  const filterPersons = (list, query) => {
    if (query === '') return list
    return list.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase())
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

        <FilterForm search={search} handleSearch={handleSearch} />

        <h2>add a new</h2>

        <PersonForm 
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={handleSubmit}
        />
        <h2>Numbers</h2>

        <PersonsList persons={filteredPersons} />
    </div>
  )
}

export default App