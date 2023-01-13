import './App.css'
import Message from '../components/Message'

function Messages() {
  // You might be wondering, no auth checks ? try it, log out and go to /messages 🤷‍♀️
  return (
    <div>
      <Message url={'http://127.0.0.1:4455/api/1/external/hello'} />
      <Message url={'http://127.0.0.1:4455/api/2/external/hello'} />
    </div>
  )
}


export default Messages
