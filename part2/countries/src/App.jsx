import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryFilter = ({ filter, onChange }) => (
  <div>
    find countries <input value={filter} onChange={onChange} />
  </div>
)

const CountryList = ({ countries, setSelectedCountry}) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  return (
    <div>
      <ul>
        {countries.map(country =>
          <li key={country.name.common}>
            {country.name.common} <button onClick={() => setSelectedCountry(country)}>show</button>
          </li>
        )}
      </ul>
    </div>
  )
}

const CountryInfo = ({ country, weatherData, setWeatherData }) => {
  if (!country) {
    return null
  }

  const capital = country.capital[0]

  if (!weatherData || weatherData.city !== capital) {
    axios
      .get(`https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1`)
      .then(response => {
        axios
          .get(`https://api.open-meteo.com/v1/forecast?latitude=${response.data.results[0].latitude}&longitude=${response.data.results[0].longitude}&current=temperature_2m,wind_speed_10m`)
          .then(response => {
            response.data.city = capital
            setWeatherData(response.data)
          })
      })
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      capital {capital}
      <br />
      area {country.area}
  
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>
            {language}
          </li>
        )}
      </ul>
  
      <img src={country.flags.svg} alt={country.flags.alt} width='160'/>

      <WeatherInfo weatherData={weatherData} />
    </div>
  )
}

const WeatherInfo = ({ weatherData }) => {
  if (!weatherData) {
    return null
  }

  return (
    <div>
      <h3>weather in {weatherData.city}</h3>
      temperature {weatherData.current.temperature_2m} Celsius
      <br />
      wind {weatherData.current.wind_speed_10m} km/h
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const onChangeFilter = event => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <CountryFilter filter={filter} onChange={onChangeFilter} />

      {filteredCountries.length !== 1 && <CountryList countries={filteredCountries} setSelectedCountry={setSelectedCountry} />}

      <CountryInfo country={filteredCountries.length !== 1 ? selectedCountry : filteredCountries[0]} weatherData={weatherData} setWeatherData={setWeatherData} />
    </div>
  )
}

export default App
