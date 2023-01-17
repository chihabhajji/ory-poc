import {
    IdentityApi,
    Configuration,
    WellknownApi,
    PermissionApi,
} from '@ory/client';

export const permissionApi = new PermissionApi(
    new Configuration({
        basePath:
            process.env.ORY_KETO_CHECK ||
            'http://127.0.0.1:4455/.ory/keto/check',
    }),
);

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
