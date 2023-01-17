import { Identity } from '@ory/client';

export const roles = ['admin', 'user'] as const;
export type Role = (typeof roles)[number];

export interface CustomIdentity extends Identity {
    internalId: string;
    roles: Role[];
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            session?: CustomIdentity;
        }
    }
}
