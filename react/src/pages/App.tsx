import './App.css'
import { Identity } from "@ory/client"
import logo from '../assets/react.svg'
import { useSession } from '../utils/hooks/sessionHook'
import Message from '../components/Message'

// 'http://127.0.0.1:4455/api/1/hello'
function App() {
  const {session, logoutUrl} = useSession();
  const getUserName = (identity: Identity) => identity.traits.email || identity.traits.username;
  
  if (!session) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="App">
    <header className="App-header">
      <img className="App-logo" alt="logo" src={logo}/>
      <p>
        Welcome to Ory PoC,{" "} { getUserName(session?.identity) }.
      </p>
      <br/>
      <a href={logoutUrl}>Logout</a>
      <Message url={'http://127.0.0.1:4455/api/1/external/hello'}/>
      <Message url={'http://127.0.0.1:4455/api/2/external/hello'}/>
    </header>
  </div>
  )
}

export default App
