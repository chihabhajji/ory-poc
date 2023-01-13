import { createContext, useEffect, useState } from 'react';
import { BASE_PATH, frontEndOryApi } from '../ory/oryClient';
import { Session } from '@ory/client';

export function useSession(): { session: SessionDetails | undefined, isLoading: boolean } {
  const [session, setSession] = useState<SessionDetails | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    frontEndOryApi.toSession()
      // TODO : type identity based on the configuration schema ?
      .then(({ data: session }) => {
        frontEndOryApi.createBrowserLogoutFlow().then(({ data: logoutflow }) => {
          setSession(new SessionDetails(session, logoutflow.logout_url))
        })
      })
      .catch((e) => {
        // window.location.replace(BASE_PATH + '/login?return_to=' + window.location.href)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { session, isLoading }
}

export const SessionContext = createContext<SessionDetails | undefined>(undefined);

export class SessionDetails {
  session: Session | undefined
  logoutUrl: string | undefined
  getUserName(): string {
    return this.session?.identity.traits.email || this.session?.identity.traits.username
  }
  public constructor(session: Session, logoutUrl: string) {
    this.session = session;
    this.logoutUrl = logoutUrl;
  }
}