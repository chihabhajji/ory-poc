import { useEffect, useState } from 'react';
import { BASE_PATH, frontEndOryApi } from '../ory/oryClient';
import { Session } from '@ory/client';

export function useSession(){
    const [session, setSession] = useState<Session | undefined>()
    const [logoutUrl, setLogoutUrl] = useState<string | undefined>()
    
    useEffect(() => {
        // Should be in an auth provider context
        frontEndOryApi.toSession()
          .then(({ data: session }) => {
            setSession(session)
            frontEndOryApi.createBrowserLogoutFlow().then(({ data: logoutflow }) => {
              setLogoutUrl(logoutflow.logout_url+'&return_to='+window.location.href)
            })
          })
          .catch((_) => {
            window.location.replace(BASE_PATH+'/login?return_to='+window.location.href)
          })
      }, [])
    return {session, logoutUrl}
}