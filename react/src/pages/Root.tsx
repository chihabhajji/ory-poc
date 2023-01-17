import { Suspense, lazy } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useInRouterContext, useRoutes } from 'react-router-dom';
import logo from '../assets/react.svg';
import { SessionContext, useSession } from '../utils/hooks/sessionHook';
import { BASE_PATH } from '../utils/ory/oryClient';
import './App.css';
import ProtectedRoute from '../components/ProtectedRoute';

const App = lazy(() => import('./App'));
const Login = lazy(() => import('./Login'));
const Messages = lazy(() => import('./Messages'));
const SecureMessage = lazy(() => import('./admin/SecureMessage'))

function Root(): JSX.Element {
  const { context, isLoading } = useSession();

  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <header className="App-header">
        <nav style={{ display: 'flex', padding: '1rem', justifyContent: 'space-between', justifyItems: 'flex-end', fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <div>
            <a href='/'>Home</a>
          </div>
          <div>
            {
              context ? (
                <a href={(context.logoutUrl + '&return_to=' + window.location.href)}>
                  Logout
                </a>
              ) : (
                <div>
                  <a href={(BASE_PATH + '/login?return_to=' + window.location.href)}>
                    Our UI Login
                  </a>
                  &nbsp;|&nbsp;
                  <a href={'/login?return_to=' + window.location.href}>
                    Ory UI Login
                  </a>
                </div>
              )
            }
          </div>
        </nav>
      </header>
      <h3 style={{ textAlign: 'center', backgroundBlendMode: 'difference', background: '#a4ef26' }}>
        {
          !window.location.pathname.startsWith('/admin') && context?.session?.identity.traits.role === 'super-admin' && <a href='/admin/messages'>psst, over here admin!</a>
        }
      </h3>
      <h1 style={{ textAlign: 'center' }}>Hello, Welcome to Ory PoC {context?.session ? context.getUserName() : 'guest'} !</h1>
      <div className="App" style={{ textAlign: 'center' }}>
        <img className="App-logo" alt="logo" src={logo} />
        <SessionContext.Provider value={context}>
          <Router>
            <Suspense fallback={<div>Loading...</div>} >
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/messages" element={context?.session?.identity.traits.role === 'super-admin' ? (<SecureMessage />) : (<Navigate replace to={'/'} />)} />
                <Route path="/messages" element={context?.session ? (<Messages />) : (<Navigate replace to={'/'} />)} />
              </Routes>
            </Suspense>
          </Router>
        </SessionContext.Provider>
      </div>
    </>
  )
}

export default Root
