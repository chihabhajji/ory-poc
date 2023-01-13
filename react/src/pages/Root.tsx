import './App.css'
import { SessionContext, useSession } from '../utils/hooks/sessionHook'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { BASE_PATH } from '../utils/ory/oryClient';
import logo from '../assets/react.svg'

const App = lazy(() => import('./App'));
const Login = lazy(() => import('./Login'));
const Messages = lazy(() => import('./Messages'));

function Root(): JSX.Element {
  const { session, isLoading } = useSession();
  if (isLoading) return <h1>Loading...</h1>
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, Welcome to Ory PoC {session?.session ? session.getUserName() : 'guest'} !</h1>
        <img className="App-logo" alt="logo" src={logo} />
      </header>
      <div>
        <SessionContext.Provider value={session}>
          <Router>
            <Suspense fallback={<div>Loading...</div>} >
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                {
                  session?.session && <Route path="/messages" element={<Messages />} shouldRevalidate={() =>true} />
                }
              </Routes>
            </Suspense>
          </Router>
        </SessionContext.Provider>
      </div>
      {
        session ? <a href={(session.logoutUrl + '&return_to=' + window.location.href)}>Logout</a> : <a href={(BASE_PATH + '/login?return_to=' + window.location.href)}>Login</a>
      }
    </div>
  )
}

export default Root
