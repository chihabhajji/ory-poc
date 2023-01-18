import { useSession } from '../utils/hooks/sessionHook';

import './App.css';

function App() {
  const { context, isLoading } = useSession();
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!context) {
    return <div>Oops</div>
  }
  return (
    <div>
      {context.session &&
        <a href='/messages'>Super secret messages!</a>
      }
    </div>)
}

export default App
