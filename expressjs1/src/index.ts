import axios from 'axios';
import express from 'express';
import AuthMiddleware from './middlewares/AuthMiddleware';

const port = process.env.PORT || 8081;
const app = express();

app.use(AuthMiddleware);
app.get('/external/hello', (req, res) => {
    axios
        .get('http://127.0.0.1:8082/internal/hello', {
            headers: { 'x-user': req.session?.internalId },
        })
        .then(({ data }) => {
            res.json({
                messages: [
                    `Hello from our API1! ${req.session?.traits?.email}, role ${req.session.traits.role}`,
                    ...data.messages,
                ]
            });
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
