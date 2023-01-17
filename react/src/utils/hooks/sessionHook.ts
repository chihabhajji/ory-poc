import { createContext, useEffect, useState } from 'react';
import { frontEndOryApi } from '../ory/oryClient';
import { Session } from '@ory/client';


export class SessionDetails {
  session: Session | undefined
  logoutUrl: string | undefined
  getUserName(): string {
    return this.session?.identity.traits.email || this.session?.identity.traits.username
  }
  setSession(session: Session) { 
    this.session = session
  }
  public constructor(session: Session, logoutUrl: string) {
    this.session = session;
    this.logoutUrl = logoutUrl;
  }
}

export const SessionContext = createContext<SessionDetails | undefined>(undefined);

export function useSession(): { context: SessionDetails | undefined, isLoading: boolean } {
  const [session, setSession] = useState<SessionDetails | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    frontEndOryApi.toSession()
      // TODO : type identity based on the configuration schema ?
      .then(({ data: session }) => {
        frontEndOryApi.createBrowserLogoutFlow().then(({ data: logoutflow }) => {
          setSession(new SessionDetails(session, logoutflow.logout_url))
          console.log(session.identity.traits.role)
        })
      })
      .catch((e) => {
        // window.location.replace(BASE_PATH + '/login?return_to=' + window.location.href)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { context: session, isLoading }
}