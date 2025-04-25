import Person from "./Person"

const PersonsList = ({ persons }) => {
    return (
      <div>
        {persons.map(person => (
          <Person key={person.name} person={person} />
        ))}
      </div>
    )
  }

  export default PersonsList