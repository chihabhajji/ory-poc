const express = require("express")
const cors = require("cors")
const { FrontendApi, Configuration } = require("@ory/client")

const app = express()

// const ory = new FrontendApi(new Configuration({
//   basePath: process.env.ORY_URL || "http://127.0.0.1:4455",
//   baseOptions: { withCredentials: true },
// }))

// app.use(
//   cors({
//     origin: ['http://127.0.0.1:3000','http://127.0.0.1:8081'],
//     credentials: true // <- Required for CORS to accept cookies and tokens.
//   }))

// app.use((req, res, next) => {
//   // A simple middleware to authenticate the request.
//   // highlight-start
//   ory
//     .toSession({
//       // This is important - you need to forward the cookies (think of it as a token)
//       // to Ory:
//       cookie: req.headers.cookie,
//     })
//     .then(({ data }) => {
//       req.session = data
//       next()
//     })
//     .catch(() => {
//       res.status(401)
//       res.json({ error: "Unauthorized" })
//     })
//   // highlight-end
// })

app.get("/hello", (req, res) => {
  return res.json({
    message: "Hello from our API 2!",
  })
})

const port = process.env.PORT || 8082
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
