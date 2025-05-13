import Person from "./Person"

const PersonsList = ({ persons, handleDelete }) => {
    return (
      <div>
        {persons.map(person => (
          <Person key={person.name} person={person} handleDelete={handleDelete} />
        ))}
      </div>
    )
  }

  export default PersonsList