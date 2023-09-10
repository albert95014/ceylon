import { useState, useEffect } from 'react'
import axios from 'axios'
import nameService from './services/names'

const Filter = ({value, handleChange}) => (
  <form>
    <div>
      filter shown with <input value={value} onChange={handleChange} />
    </div>
  </form>
)

const PersonForm = ({persons, newName, newNumber, handleNameChange, handleNumberChange, confirmName, addName}) => (
  <form onSubmit={persons.map(person => person.name).includes(`${newName}`) ? ()=>confirmName(newName, newNumber) : addName}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({filteredPersons, removePerson}) => {
  return (
    <ul>
      {filteredPersons.map((filteredPerson) => 
        <li key={filteredPerson.name}>
          {filteredPerson.name} {filteredPerson.number}
          {/* <Button label="delete" onClick={console.log("banana")} /> */}
          <button onClick={() => removePerson(filteredPerson.id, filteredPerson.name)}>delete</button>
        </li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const hook = () => {
    console.log('effect')
    nameService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        console.log(response.data)
        setPersons(response.data)
        setFilteredPersons(response.data)
      })
  }

  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    console.log(persons.map(person => person.name))
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    nameService 
      .create(nameObject)
      .then(response => {
        console.log(response.data)
      })

    setPersons(persons.concat(nameObject))
    setFilteredPersons(filteredPersons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const confirmName = (name, newNumber) => {
    if (window.confirm(`${newName} is already added to the phonebook. Would you like to update the old number with ${newNumber}?`)) {
      const person = filteredPersons.find(person => person.name === name)
      const changedNumber = {...person, number: newNumber}
      nameService
        .update(person.id, changedNumber)
        .then(response => {
          console.log(response)
        })
    }
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterNameChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value)
    setFilteredPersons(persons.filter((person) => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const removePerson = (id, name) => {
    console.log("banana")

    if (window.confirm(`Delete ${name}?`))
      nameService
        .remove(id)
        .then (response => {
          console.log(response.data)
          setFilteredPersons(filteredPersons.filter(person => person.id !== id))
        })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterName} handleChange={handleFilterNameChange} />
      <h2>Add a new</h2>
      <PersonForm persons={persons}
                  newName={newName} 
                  newNumber={newNumber} 
                  handleNameChange={handleNameChange} 
                  handleNumberChange={handleNumberChange} 
                  confirmName={confirmName} 
                  addName={addName} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} removePerson={removePerson} />
    </div>
  )
}

export default App