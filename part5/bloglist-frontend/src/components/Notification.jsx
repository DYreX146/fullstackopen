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
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  )
}

export default Notification