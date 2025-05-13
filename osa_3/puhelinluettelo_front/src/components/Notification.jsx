const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  const notificationStyle = {
    color: type === 'black',
    background: type === 'error' ?  '#ca5656': '#7dc98f',
    border: type === 'error' ? '5px solid #ff0000' : '5px solid #00ff00',
    padding: '15px',
    marginBottom: '5px',
    borderRadius: '10px'
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification