import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import { CustomIdentity } from '../models/OryModels';
import { ory } from '../utils/Oryclients';

export default function AuthMiddleWare(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Same as 1 but using the passed Id in the header, no need to decode, this is to be used mostly when doing internal calls
    // Can also check for stale session

    if (req.headers['x-user']) {
        ory.getSession(
            {
                id: req.headers['x-user'].toString(),
                expand: ['Identity'],
            },
            { withCredentials: true },
        )
            .then(({ data }) => {
                req.session = data.identity as CustomIdentity;
                next();
            })
            .catch((e: AxiosError) => {
                if (e.status === 401) {
                    res.status(401).json({ error: 'Unauthorized' });
                } else {
                    res.status(500).json(e.response.data);
                }
            });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
