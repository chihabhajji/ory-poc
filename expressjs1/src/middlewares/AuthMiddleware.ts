import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import jwktopem from 'jwk-to-pem';
import { jwkApi } from '../utils/OryClients';

// Using id_token
export default function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // We get the bearer token
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        if (token) {
            // We fetch the JWK's using the private Admin SDK
            jwkApi
                .discoverJsonWebKeys()
                .then(({ data: jwKeySet }) => {
                    // TODO : Cache data in memory ?
                    // Decode the bearer token using JWK's
                    // eslint-disable-next-line prettier/prettier
                    const publicKey = jwktopem(jwKeySet?.keys?.at(0) as jwktopem.JWK);
                    const decoded = verify(token, publicKey);
                    // Exchange it for session info expanded with the identity traits
                    console.log(decoded);
                    req.session = decoded;
                    next();
                })
                .catch(() => {
                    res.status(500).json({ error: 'Unable to fetch JWKs' });
                });
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ory.getSession(
//     {
//         id: decoded.id,
//         expand: ['Identity'],
//     },
//     { withCredentials: true },
// )
//     .then(({ data }) => {
//         // We then pass them to the next handler
//         req.session = data.identity as CustomIdentity;
//         req.session.internalId = decoded.id;
//         next();
//     })
//     .catch((e: AxiosError) => {
//         // If we got 401 we return unauthorized, otherwise, it must have been a configuration issue, so we return 500
//         if (e.status === 401) {
//             res.status(401).json({ error: 'Unauthorized' });
//         } else {
//             res.status(500).json(e.message);
//         }
//     });
