import './App.css'

import { useSession } from '../utils/hooks/sessionHook';


function App() {
  const { session, isLoading } = useSession();
  return (<div>
    { session?.session && 
      <a href='/messages'>Super secret messages!</a>
    }
  </div>)
}

export default App
