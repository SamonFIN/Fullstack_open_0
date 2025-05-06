const FindForm = ({ search, handleSearch }) => {
    return (
        <>
            find countries: 
            <input 
            value={search}
            onChange={handleSearch} 
            />
        </>
    )
  }

export default FindForm