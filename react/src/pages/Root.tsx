import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import logo from '../assets/react.svg';
import { SessionContext, useSession } from '../utils/hooks/sessionHook';
import { BASE_PATH } from '../utils/ory/oryClient';
import './App.css';

const App = lazy(() => import('./App'));
const Login = lazy(() => import('./Login'));
const Messages = lazy(() => import('./Messages'));
const SecureMessage = lazy(() => import('./admin/SecureMessage'))

function Root(): JSX.Element {
  const { context, isLoading } = useSession();
  console.log(context?.session?.identity)
  if (isLoading) return <h1>Loading...</h1>

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <header className="App-header">
        <nav style={{ display: 'flex', padding: '1rem', justifyContent: 'space-between', justifyItems: 'flex-end', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <div>
            <a href='/'>Home</a>
          </div>
          <a href={context ? (context.logoutUrl + '&return_to=' + window.location.href) : (BASE_PATH + '/login?return_to=' + window.location.href)}>
            {context ? 'Logout' : 'Login'}
          </a>
        </nav>
      </header>
      <h1 style={{textAlign: 'center'}}>Hello, Welcome to Ory PoC {context?.session ? context.getUserName() : 'guest'} !</h1>
      <div className="App" style={{ textAlign: 'center' }}>
        <img className="App-logo" alt="logo" src={logo} />
        <SessionContext.Provider value={context}>
          <Router>
            <Suspense fallback={<div>Loading...</div>} >
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                {
                  context?.session && <Route path="/messages" element={<Messages />} />
                }
                {
                  context?.session?.identity.role === 'Admin' && <Route path="/admin/message" element={<SecureMessage />} />
                }
              </Routes>
            </Suspense>
          </Router>
        </SessionContext.Provider>
      </div>
    </>
  )
}

export default Root
