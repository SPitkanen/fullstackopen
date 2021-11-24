import React, { useState } from 'react'

const Person = ({ person }) => {
  return (
    <div>
      <p>{person.name}, {person.number}</p>
    </div>
  )
}

const ShowPersons = (props) => {
  return (
    <div>
      {props.persons.filter(person => person.name.includes(props.filter) || person.number.includes(props.filter)).map(person => <Person key={person.name} person={person} />)}
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
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', show: true },
    { name: 'Ada Lovelace', number: '39-44-5323523', show: true },
    { name: 'Dan Abramov', number: '12-43-234345', show: true },
    { name: 'Mary Poppendieck', number: '39-23-6423122', show: true }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      show: true
    }
    if (persons.some(person => person.name === newName)) {
      window.alert(`${newName} is already in use!`)
      setNewName('')
      setNewNumber('')
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
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
      <Filter filter={newFilter} change={handleFilterChange} />
      <h2>Add new</h2>
      <AddPerson addPerson={addPerson} name={newName} handleName={handleNameChange} number={newNumber} handleNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <ShowPersons persons={persons} filter={newFilter} />
    </div>
  )

}

export default App
