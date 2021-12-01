import React, { useState, useEffect } from 'react'
import axios from 'axios' 

const Find = ({handleFilterChange, value}) => {
  return (
    <div>
      Find Countries <input onChange={(event) => handleFilterChange(event.target.value)}/>
    </div>
  )
}

const Language = ({language}) => {
  console.log('kieliä')
  return (
    <div>
      <p>{language}</p>
    </div>
  )
}
const Country = ({country}) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {Object.keys(country.languages).map(key => <Language key={country.languages[key]} language={country.languages[key]} />)}
      </ul>
      <img src={country.flags.png} alt={country.name.common}/>
    </div>
  )
}

const Button = ({ action, name, text }) => {
  console.log('Button maalle: ', name)
  return(
    <div>
      <button onClick={() => action(name)}>{text}</button>
    </div>
  )
}

const CountryName = ({action, name}) => {
  console.log('country')
  return(
    <div>
      <p>{name.common} <Button action={action} name={name.common} text='Show' /></p>
    </div>
  )
}
const Countries = ({ action, countries}) => {
  console.log('countries')
  return(
    <ul>
      {countries.map(country => <CountryName key={country.name.common} action={action} name={country.name}/>)}
    </ul>
  )
}

const Message = () => {
  return(
    <div>
      <p>Too many matches, specify another filter</p>
    </div>
  )
}

const ShowResults = ({ action, filter, countries }) => {
  let filteredCountries = []
  filteredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(filter.toLowerCase())
  })
  let filteredCountriesLength = filteredCountries.length
  console.log('Country count: ', filteredCountriesLength)
  if (filteredCountriesLength > 10) {
    return(
      <div>
        <Message />   
      </div>
    )
  }
  if (filteredCountriesLength < 11 && filteredCountriesLength > 1) {
    console.log('yli 1 alle 10')
    return(
      <div>
        <Countries action={action} countries={filteredCountries}/>
      </div>
    )
  }
  if (filteredCountriesLength === 1) {
    console.log('tasan yksi maa')
    return(
      <div>
        <Country country={filteredCountries[0]} />
      </div>
    )
  }
  return(
    <div>
      <p>No countries with this filter</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (filterValue) => {
    console.log('Ensimmäinen loki: ', filterValue)
    setFilter(filterValue)
  }

  const onButtonClick = (countryName) => {
    setFilter(countryName)
  }

  return (
    <div>
      <Find handleFilterChange={handleFilterChange} />
      <ShowResults action={onButtonClick} filter={filter} countries={countries} />
    </div>
  )
}

export default App;
