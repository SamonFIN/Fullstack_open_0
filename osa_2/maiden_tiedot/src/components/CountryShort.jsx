const CountryShort = ({ country, handleShow }) => {
    const handleClick = () => {
        handleShow(country)
    }
    return (
        <div>
            {country.name.common} <button onClick={handleClick}>show</button>
        </div>
    )
}

export default CountryShort