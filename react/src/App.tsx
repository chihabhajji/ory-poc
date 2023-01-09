import React, { useEffect, useState } from "react"
import logo from "./logo.svg"
import "./App.css"

// highlight-start
import { FrontendApi, Configuration, Session, Identity } from "@ory/client"
import axios from "axios"
// Get your Ory url from .env
// Or localhost for local development
const basePath = process.env.REACT_APP_ORY_URL || "http://localhost:4000"

const ory = new FrontendApi(
  new Configuration({
    basePath,
    baseOptions: {
      withCredentials: true,

    },
  }),
)

function App() {
  const [session, setSession] = useState<Session | undefined>()
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>()
  const [helloData, setHelloData] = useState({})
  // Returns either the email or the username depending on the user's Identity Schema
  const getUserName = (identity: Identity) => identity.traits.email || identity.traits.username

  // highlight-end

  // highlight-start
  // Second, gather session data, if the user is not logged in, redirect to login
  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        // User has a session!
        setSession(data)
        ory.createBrowserLogoutFlow().then(({ data }) => {
          // Get also the logout url
          setLogoutUrl(data.logout_url)
          console.log('checking state')
        })
        // i'm pretty sure this causes a re render but fuck react, idfc
        axios.get('http://localhost:8081/api/hello', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }).then(({data}) => {
          setHelloData(data)
        })
      })
      .catch((err) => {
        console.error(err)
        // Redirect to login page
        window.location.replace(`${basePath}/ui/login`)
      })
  }, [])

  if (!session) {
    // Still loading
    return <h1>Loading...</h1>
  }
  // highlight-end

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
        {JSON.stringify(helloData, null, 2) }
      </header>
    </div>
  )
}

export default App
