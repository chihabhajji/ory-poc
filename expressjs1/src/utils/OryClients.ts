import { IdentityApi, Configuration, WellknownApi } from '@ory/client';

export const ory = new IdentityApi(
    new Configuration({
        basePath:
            process.env.ORY_PUBLIC ||
            'http://127.0.0.1:4455/.ory/kratos/private',
    }),
);

export const jwkApi = new WellknownApi(
    new Configuration({
        basePath: process.env.ORY_ADMIN || 'http://127.0.0.1:4456',
    }),
);
