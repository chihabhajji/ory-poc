import axios from 'axios';
import express from 'express';
import {
    VallidationError,
    GenericError,
    Message,
    FlowError,
    GenericErrorContent,
    Warning,
    UiText,
} from '@ory/client';
import AuthMiddleware from './middlewares/AuthMiddleware';

const port = process.env.PORT || 8081;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/external/*', AuthMiddleware);

app.use((error, req, res, next) => {
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
                    `Hello from our API1! ${req.session?.traits?.email}, role ${req.session.role}`,
                    ...data.messages,
                ],
            });
        });
});

app.post('/registration/process', (req, res) => {
    console.log('hello');

    res.status(403).json({
        "messages": [
            {
                "instance_ptr": "#/traits/newsletter",
                "messages": [
                    {
                        "id": 123,
                        "text": "Can only register when eat a dick ",
                        "type": "error",
                        "context": {
                            "value": "shorter than your pp"
                        }
                    }
                ]
            }
        ]
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
