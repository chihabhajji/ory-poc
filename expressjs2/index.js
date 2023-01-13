const express = require("express")
const cors = require("cors")
const { IdentityApi, Configuration } = require("@ory/client")

const app = express()

const ory = new IdentityApi(new Configuration({
  basePath: 'http://127.0.0.1:4455/.ory/kratos/private',
}))

app.use((req, res, next) => {
  console.log(req.headers['x-user'])
  ory
    .getSession({
      id: req.headers['x-user'],
      expand: "Identity"
    }, { withCredentials: true })
    .then(({ data }) => {
      req.session = data.identity
      next()
    })
    .catch((e) => {
      if (e.response.data.error?.code == 404) {
        console.debug(e.request._header)
        res.status(500).json(e.response.data.error)
      } else {
        res.status(401)
        res.json({ error: "Unauthorized" })
      }
    })
})

app.get("/internal/hello", (req, res) => {
  res.json({
    messages: ["Hello from our API 2 " + req.session.traits.email + ' (internal)!']
  })
})

app.get("/external/hello", (req, res) => {
  res.json({
    messages: ["Hello from our API 2 " + req.session.traits.email + ' (external)!']
  })
})

const port = process.env.PORT || 8082
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
