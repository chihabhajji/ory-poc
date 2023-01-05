// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const express = require("express")
const cors = require("cors")
const { FrontendApi, Configuration } = require("@ory/client")

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
const allowedDomains = [process.env.UI_URL || "http://localhost:3000", "http://localhost:8081"];
app.use(
  // highlight-start
  cors({
    origin: "http://localhost:8081",
    credentials: true, // <- Required for CORS to accept cookies and tokens.
  }),
  // highlight-end
)

app.use((req, res, next) => {
  // A simple middleware to authenticate the request.
  // highlight-start
  ory
    .toSession({
      // This is important - you need to forward the cookies (think of it as a token)
      // to Ory:
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
  // highlight-end
})

app.get("/api/hello", (req, res) => {
  console.debug({
    api: 2,
    session_id: req.session.id,
    identity_traits: req.session.identity.traits,
  })
  res.json({
    message: "Hello from our API 2!",
  })
})

const port = process.env.PORT || 8082
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
