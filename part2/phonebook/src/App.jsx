import { useState, useEffect } from 'react'
import personService from './services/persons'

const ContactFilter = ({ filter, onChange }) => (
  <div>
    filter by name: <input value={filter} onChange={onChange} />
  </div>
)

const AddContactForm = ({ onSubmit, newName, onChangeName, newNumber, onChangeNumber }) => (
  <div>
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onChangeName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onChangeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
)

const ContactList = ({ contacts, deletePerson }) => (
  <div>
    <ul>
      {contacts.map(person =>
        <li key={person.name}>
          {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
        </li>
      )}
    </ul>
  </div>
)

const Notification = ({ notificationMessage }) => {
  if (notificationMessage === null) {
    return null
  }

  const { message, isError } = notificationMessage

  const color = isError ? 'red' : 'green'

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(people => setPersons(people))
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            setNewName('')
            setNewNumber('')
            setNotificationMessage({
              message: `Number for ${updatedPerson.name} updated to ${updatedPerson.number}`,
              isError: false
            })
            setTimeout(() => setNotificationMessage(null), 5000)
          })
          .catch(error => {
            setNotificationMessage({
              message: error.response.data.error,
              isError: true
            })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMessage({
            message: `Added ${newPerson.name}`,
            isError: false
          })
          setTimeout(() => setNotificationMessage(null), 5000)
        })
        .catch(error => {
          setNotificationMessage({
            message: error.response.data.error,
            isError: true
          })
          setTimeout(() => setNotificationMessage(null), 5000)
        })
    }
  }

  const deletePerson = id => {
    const person = persons.find(person => person.id === id)

    if (confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMessage({
            message: `Deleted ${person.name}`,
            isError: false
          })
          setTimeout(() => setNotificationMessage(null), 5000)
        })
    }
  }

  const filteredContacts = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notificationMessage={notificationMessage} />
      
      <ContactFilter filter={filter} onChange={event => setFilter(event.target.value)} />

      <h3>Add new contact</h3>
      <AddContactForm
        onSubmit={addPerson}
        newName={newName}
        onChangeName={event => setNewName(event.target.value)}
        newNumber={newNumber}
        onChangeNumber={event => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>
      <ContactList contacts={filteredContacts} deletePerson={deletePerson}/>
    </div>
  )
}

export default App