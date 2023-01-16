import { IdentityApi, Configuration } from '@ory/client';

export const ory = new IdentityApi(
    new Configuration({
        basePath: 'http://127.0.0.1:4455/.ory/kratos/private',
    }),
);
