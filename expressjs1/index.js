const express = require("express")
const cors = require("cors")
const { FrontendApi, Configuration } = require("@ory/client")
const axios = require("axios")
const app = express()
// highlight-start
const ory = new FrontendApi(
  new Configuration({
    // Points to the local Ory API server (Ory TunneL).
    basePath: process.env.ORY_URL || "http://localhost:4000",
    baseOptions: { withCredentials: true },
  }),
)
// highlight-end
const allowedDomains = [process.env.UI_URL || "http://localhost:3000", "http://localhost:8082"];
app.use(
  // highlight-start
  cors({
    origin: process.env.UI_URL || "http://localhost:3000",
    credentials: true, // <- Required for CORS to accept cookies and tokens.
  }),
  // highlight-end
)

app.use((req, res, next) => {
  // A simple middleware to authenticate the request.
  ory
    .toSession({
      cookie: req.headers.cookie,
    })
    .then(({ data }) => {
      req.session = data
      next()
    })
    .catch(() => {
      res.status(401)
      res.json({ error: "Unauthorized" })
    })
})

app.get("/api/hello", async (req, res) => {
  const {data} = await axios.create({ 
    baseURL: "http://localhost:8082",
    headers: {...req.headers}
  })
  .get("/api/hello", { withCredentials: true });
  return res.json({
    message1: "Hello from our API1!",
    message2: data.message
  })
})

const port = process.env.PORT || 8081
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


  // console.debug({
  //   api: 1,
  //   session_id: req.session.id,
  //   identity_traits: req.session.identity.traits,
  // })