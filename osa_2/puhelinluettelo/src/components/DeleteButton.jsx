const DeleteButton = ({ person, handleDelete }) => {
    const handleclick = (event) => {
        event.preventDefault()
        handleDelete(person.id)
    }
    return(
        <button onClick={handleclick}>delete</button>
    )
}

export default DeleteButton