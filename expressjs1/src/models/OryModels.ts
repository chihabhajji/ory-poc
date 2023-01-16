import { Identity } from '@ory/client';

export enum ROLES_ENUM {"customer"= "customer", "super-admin" = "super-admin", "restaurant-owner" = "restaurant-owner", "delivery-boy" = "delivery-boy", "agent" = "agent"}
export interface CustomIdentity extends Identity {
    internalId: string;
    role: ROLES_ENUM
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            session?: CustomIdentity;
        }
    }
}
