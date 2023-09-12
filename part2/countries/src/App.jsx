import { useState, useEffect } from 'react'
import axios from 'axios'
import countriesService from './services/countries'
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const Searchbar = ({value, handleChange}) => (
  <div>
    <form>
        find countries <input value={value} onChange={handleChange} />
    </form>
  </div>
)

const Button = ({ text, handleClick }) => 
  <button value={text} onClick={handleClick}>show</button>


const Results = ({ searchFor, searchResults, showSingleResult, setWeatherUrl, temp, weatherIcon, windSpeed }) => {
  if (searchFor.length > 0 && searchResults.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (searchFor.length > 0 && searchResults.length < 11 && searchResults.length > 1) {
    return (
      <ul>
        {searchResults.map((result) => <li key={result.name.common}>{result.name.common} <Button text="show" handleClick={() => showSingleResult(result.name.common)} /></li>)}
      </ul>
    )
  }

  if (searchFor.length > 0 && searchResults.length === 1) {
    const singleResult = searchResults[0]
    const languages = Object.values(searchResults[0].languages)

    //Delayed to prevent updating App while rendering Results error
    setTimeout(() => {setWeatherUrl(`https://api.openweathermap.org/data/2.5/weather?lat=${singleResult.latlng[0]}&lon=${singleResult.latlng[1]}&appid=${WEATHER_API_KEY}`)},0)

    return (
      <div>
        <h1>{singleResult.name.common}</h1>
        <p>Capital: {singleResult.capital}</p>
        <p>Area: {singleResult.area}</p>
        <h2>Languages:</h2>
        <ul>
          {languages.map((result) => <li key={result}>{result}</li>)}
        </ul>
        <img src={singleResult.flags.png}></img>
        <h2>Weather in {singleResult.name.common}</h2>
        <p>Temperature: {temp} Celcius</p>
        <img src={weatherIcon}></img>
        <p>Wind: {windSpeed} m/s</p>
      </div>
    )
  }

  if (searchFor.length === 0) {
    return null
  }
}

const App = () => {
   //-------------------------COUNTRIES----------------------------
  const [countries, setCountries] = useState([])
  const [searchFor, setSearchFor] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const countriesHook = () => {
    countriesService
      .getAll()
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log('failed to get countries')
      })
  }

  useEffect(countriesHook, [])

  //-------------------------WEATHER----------------------------
  const [weatherUrl, setWeatherUrl] = useState(null)
  const [temp, setTemp] = useState("")
  const [weatherIcon, setWeatherIcon] = useState("")
  const [windSpeed, setWindSpeed] = useState("")
    
  const weatherHook = () => {
    axios
      .get(weatherUrl)
      .then(response => {
        setTemp((response.data.main.temp - 273.15).toFixed(2))
        setWeatherIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
        setWindSpeed(response.data.wind.speed)
      })
      .catch(error => {
        console.log("failed to get weather")
      })
  }

  useEffect(weatherHook, [weatherUrl])

  const searchCountry = (event) => {
    event.preventDefault()
    setSearchFor(event.target.value)
    setSearchResults(countries.filter((country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))))
    // console.log(searchResults)
  }

  const showSingleResult = (country) => {
    // console.log(country)
    setSearchResults(searchResults.filter(results => results.name.common.includes(country)))
  }

  return (
    <div>
      <Searchbar value={searchFor} handleChange={searchCountry} />
      <Results searchFor={searchFor} 
               searchResults={searchResults} 
               showSingleResult={showSingleResult} 
               setWeatherUrl={setWeatherUrl} 
               temp={temp} 
               weatherIcon={weatherIcon} 
               windSpeed={windSpeed} />
    </div>
  )
}

export default App
