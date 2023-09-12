import axios from 'axios'
const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryNameUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'

const getAll = () => {
    return axios.get(allCountriesUrl)
}

export default { getAll }
