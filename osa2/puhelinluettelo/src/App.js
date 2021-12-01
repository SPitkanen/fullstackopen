import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Person = ({ person, action }) => {
  return (
    <div>
      <p>{person.name}, {person.number}</p><button onClick={() => action(person)}>Remove</button>
    </div>
  )
}

const ShowPersons = (props) => {
  return (
    <div>
      {props.persons.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase()) || person.number.includes(props.filter.toLowerCase())).map(person => <Person key={person.name} person={person} action={props.action} />)}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      <form>
        <div>Filter with <input value={props.filter} onChange={props.change}/></div>
      </form>
    </div>
  )
}

const AddPerson = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
        <div>Name: <input value={props.name} onChange={props.handleName}/></div>
        <div>Number: <input value={props.number} onChange={props.handleNumber}/></div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const timeout = () => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      show: true
    }
    if (persons.some(person => person.name === newName)) {
      const id = persons.find(person => person.name === newName).id
      console.log(id)
      if (window.confirm(`${newName} is already in phonebook, Do you want to update number?`)) {
        personService
        .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setMessage(`${newName} yhteystiedot päivitetty`)
            timeout()
          })
        .catch(error => {
          setMessage(
            `Yhteystieto '${newName}' on jo poistettu`
          )
          setPersons(persons.filter(person => person.id !== id))
          timeout()
        })
      }
      setNewName('')
      setNewNumber('')
    } else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
          })
      setMessage(`${newName} yhteystiedot lisätty`)
      timeout()
      setNewName('')
      setNewNumber('')
    }
  }

  const removePerson = (person) => {
    if (window.confirm(`Haluatko varmasti poistaa yhteystiedon ${person.name}?`)) {
      personService
        .remove(person.id)
          .then(() => true)
        .catch(error => {
          setMessage(
            `Yhteystieto '${person.name}' on jo poistettu`
          )
          timeout()
        })
      const id = person.id
      setPersons(persons.filter(person => person.id !== id))
      setMessage(`${person.name} yhteystiedot poistettu`)
      timeout()
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Filter filter={newFilter} change={handleFilterChange} />
      <h2>Add new</h2>
      <AddPerson addPerson={addPerson} name={newName} handleName={handleNameChange} number={newNumber} handleNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <ShowPersons persons={persons} filter={newFilter} action={removePerson} />
    </div>
  )

}

export default App
