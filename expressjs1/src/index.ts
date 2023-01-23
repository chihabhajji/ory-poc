import axios from 'axios';
import express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from './middlewares/AuthMiddleware';

const port = process.env.PORT || 8081;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/external/*', AuthMiddleware);

app.use((error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500);
    res.json({ message: error.message || 'You done goofed' });
});

app.get('/external/hello', (req, res) => {
    axios
        .get('http://127.0.0.1:8082/internal/hello', {
            headers: { 'x-user': req.session?.id },
        })
        .then(({ data }) => {
            res.json({
                messages: [
                    `Hello from our API1! ${req.session?.username}, role ${req.session.role}`,
                    ...data.messages,
                ],
            });
        });
});

app.post('/registration/process', (req, res) => {
    const shouldILetYouIn = Math.random() * 2;
    if (shouldILetYouIn >= 1) {
        res.status(200);
    } else {
        res.status(403).json({
            messages: [
                {
                    instance_ptr: '#/traits/newsletter',
                    messages: [
                        {
                            id: 123,
                            text: 'Can only register when eat a dick ',
                            type: 'error',
                            context: {
                                value: 'shorter than your pp',
                            },
                        },
                    ],
                },
            ],
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
