const Notification = ({ message, type }) => {
    if (!message) {
      return null
    }
  
    const notificationStyle = {
      color: type === 'black',
      background: type === 'error' ?  '#ca5656': '#ffffff',
    }
  
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }
  
  export default Notification