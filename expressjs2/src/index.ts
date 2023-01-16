import express from 'express';
import AuthMiddleWare from './middlewares/AuthMiddleware';

const app = express();

app.use(AuthMiddleWare);

app.get('/internal/hello', (req, res) => {
    res.json({
        messages: [
            `Hello from our API 2 ${req.session.traits.email} (internal)!`,
        ],
    });
});

app.get('/external/hello', (req, res) => {
    res.json({
        messages: [
            `Hello from our API 2 ${req.session.traits.email} (external)!`,
        ],
    });
});

app.get('/external/hydration', (req, res) => {
  // TODO
    console.log(req.session);
    res.json({
        messages: [
            `Hello from our API 2 ${req.session.traits.email} (external)!`,
        ],
    });
});

const port = process.env.PORT || 8082;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
