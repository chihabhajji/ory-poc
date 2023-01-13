import './App.css'
import { useContext, useEffect, useState } from 'react'
import { SessionContext } from '../utils/hooks/sessionHook';
import { frontEndOryApi } from '../utils/ory/oryClient';
import { LoginFlow } from '@ory/client';
function Login() {
  const session = useContext(SessionContext);
  const [ action , setAction ] = useState<LoginFlow | undefined>()
  useEffect(() => {
    frontEndOryApi.createBrowserLoginFlow({returnTo: window.location.href, aal: 'aal1'})
        .then(({data: flow}) => {
            console.log(flow)
            setAction(flow)
        })
  }, [])
  if (session?.session) {
    return <h1>Return to history or /</h1>
  }
  return (
    <>

        <form action={action?.ui.action} method={action?.ui.method}>
            {
                action?.ui.nodes.map((node, i) => {
                    return <div>
                        <input type={node.attributes['type']} 
                        name={node.attributes['name']}  
                        defaultValue={node.attributes['value']} 
                        key={i}/>
                    </div>
                })
            }
        </form>

    </>
  )
}


export default Login
