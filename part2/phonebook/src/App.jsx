import { useState } from 'react'

const Filter = ({value, handleChange}) => (
  <form>
    <div>
      filter shown with <input value={value} onChange={handleChange} />
    </div>
  </form>
)

const PersonForm = ({persons, newName, newNumber, handleNameChange, handleNumberChange, alertName, addName}) => (
  <form onSubmit={persons.map(person => person.name).includes(`${newName}`) ? alertName : addName}>
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

const Persons = ({filteredPersons}) => (
  <ul>
    {filteredPersons.map((filteredPerson) => 
      <li key={filteredPerson.name}>{filteredPerson.name} {filteredPerson.number}</li>)}
</ul>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const addName = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    console.log(persons.map(person => person.name))
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    setPersons(persons.concat(nameObject))
    setFilteredPersons(filteredPersons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const alertName = () => {
    alert(`${newName} is already added in the phonebook`)
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
                  alertName={alertName} 
                  addName={addName} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App