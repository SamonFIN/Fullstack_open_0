import CountryFull from './CountryFull'
import CountryShort from './CountryShort'

const Countries = ({ countries, handleShow}) => {
    if (countries.length > 1) {
        return (
            <div>
                {countries.map(country =>(
                    <CountryShort key={country.name.common} country={country} handleShow={handleShow} />
                ))}
            </div>
        )
    }
    else if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <CountryFull country={country}/>
            </div>
        )
    }
}

export default Countries