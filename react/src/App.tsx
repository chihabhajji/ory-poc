import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"

// highlight-start
import { FrontendApi, IdentityApi,Configuration, Session, Identity } from "@ory/client"
import axios from "axios"
// Get your Ory url from .env
// Or localhost for local development
const basePath = process.env.REACT_APP_ORY_URL || "http://127.0.0.1:4455"

const config = new Configuration({
  basePath: `${basePath}/.ory/kratos/public`,
  baseOptions: {
    withCredentials: true
}})
const identityApi = new IdentityApi(config);
const frontEndOryApi = new FrontendApi(config)

function App() {
  const [session, setSession] = useState<Session | undefined>()
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>()
  const [v1Data, setv1Data] = useState<{message: string} | undefined>(undefined)
  // Returns either the email or the username depending on the user's Identity Schema
  const getUserName = (identity: Identity) => identity.traits.email || identity.traits.username;

  // Second, gather session data, if the user is not logged in, redirect to login
  useEffect(() => {
    frontEndOryApi
      .toSession()
      .then(({ data }) => {
        // User has a session!
        setSession(data)
        frontEndOryApi.createBrowserLogoutFlow().then(({ data }) => {
          setLogoutUrl(data.logout_url+'&return_to=http://127.0.0.1:3000/')
          axios.get('http://127.0.0.1:4455/api/1/hello', {withCredentials: true})
          .then(({data}) => setv1Data(data))
          .catch(({response}) => console.error(response))
        })
      })
      .catch((err) => {
        window.location.replace(basePath+'/login?return_to=http://127.0.0.1:3000/')
      })
  }, [])

  if (!session) {
    // Still loading
    return <h1>Loading...</h1>
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Ory,{" "}
          {
            // highlight-next-line
            getUserName(session?.identity)
          }
          .
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {
          // highlight-next-line
          // Our logout link
          <a href={logoutUrl}>Logout</a>
        }
        1
        {JSON.stringify(v1Data, null, 2) }
      </header>
    </div>
  )
}

export default App
