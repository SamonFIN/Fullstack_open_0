import DeleteButton from "./DeleteButton"

const Person = ({ person, handleDelete }) => {
    return (
      <div>
        {person.name} {person.number} <DeleteButton person={person} handleDelete={handleDelete} />
      </div>
    )
  }

  export default Person