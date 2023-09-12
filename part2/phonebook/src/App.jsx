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

const PersonForm = ({persons, newName, newNumber, handleNameChange, handleNumberChange, addName}) => (
  <form onSubmit={addName}>
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

const SuccessNotification = ({message}) => {
  const messageStyle = {
    color: 'green',
    background: 'lightgray',
    border: '2px green solid',
    height: '36px',
    fontSize: '24px'
  }

  if (message===null) {
    return null
  } 
  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const ErrorNotification = ({message}) => {
  const messageStyle = {
    color: 'red',
    background: 'lightgray',
    border: '2px red solid',
    height: '36px',
    fontSize: '24px'
  }

  if (message===null) {
    return null
  } 
  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      .catch(error => {
        alert('Failed to get names')
      })
  }

  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    console.log(persons.map(person => person.name))
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(`${newName}`)) {
      if (window.confirm(`${newName} is already added to the phonebook. Would you like to update the old number with ${newNumber}?`)) {
        const selectedPerson = filteredPersons.find(person => person.name === (`${newName}`))
        const changedNumber = {...selectedPerson, number: newNumber}
        nameService
          .update(selectedPerson.id, changedNumber)
          .then(response => {
            console.log(response.data)
            setSuccessMessage(
              `Changed ${newName}'s number to ${newNumber}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== selectedPerson.id ? person : response.data))
            setFilteredPersons(filteredPersons.map(person => person.id !== selectedPerson.id ? person : response.data))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(
              `${newName}'s information has already been removed from the server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== selectedPerson.id))
            setFilteredPersons(filteredPersons.filter(person => person.id !== selectedPerson.id))
          })
        }
      } else {
        nameService 
          .create(nameObject)
          .then(response => {
            console.log(response.data)
            setSuccessMessage(
                `Added ${newName}`
              )
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
            setPersons(persons.concat(response.data))
            setFilteredPersons(filteredPersons.concat(response.data))
            setNewName('')
            setNewNumber('')
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
    console.log("id", id)

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
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter value={filterName} handleChange={handleFilterNameChange} />
      <h2>Add a new</h2>
      <PersonForm persons={persons}
                  newName={newName} 
                  newNumber={newNumber} 
                  handleNameChange={handleNameChange} 
                  handleNumberChange={handleNumberChange} 
                  // confirmName={confirmName} 
                  addName={addName} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} removePerson={removePerson} />
    </div>
  )
}

export default App