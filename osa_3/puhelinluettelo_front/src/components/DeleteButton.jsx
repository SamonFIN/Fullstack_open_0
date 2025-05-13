const DeleteButton = ({ person, handleDelete }) => {
    const handleclick = (event) => {
        event.preventDefault()
        handleDelete(person.id)
        console.log(`person ${person.name} id ${person.id} deleted`)
    }
    return(
        <button onClick={handleclick}>delete</button>
    )
}

export default DeleteButton