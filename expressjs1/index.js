const { IdentityApi, WellknownApi, JwkApi,Configuration, OAuth2Api } = require("@ory/client")
const express = require("express")
const jose = require('jose')
const app = express()
const jwktopem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const { default: axios } = require("axios")

const ory = new IdentityApi(new Configuration({
  basePath: 'http://127.0.0.1:4455/.ory/kratos/private',
}))
const jwkApi = new WellknownApi({
  basePath: 'http://127.0.0.1:4456'
})


app.use((req, res, next) => {
  jwkApi
    .discoverJsonWebKeys()
    .then(({ data: jwks }) => {
      // Cache data in memory ?*
      const token = req.headers.authorization.split('Bearer ')[1];
      const publicKey = jwktopem(jwks.keys[0])
      const decoded = jwt.verify(token, publicKey)
      ory.getSession({
        id: decoded.id,
        expand: "Identity"
      }, { withCredentials: true })
      .then(({ data }) => {
        req.session = data.identity
        req.session.internal = decoded.id
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
    .catch((e) => {
      console.error(e)
      res.status(500).send('Unable to fetch JWKs')
    })
});

app.get("/external/hello", (req, res) => {
  axios.get('http://127.0.0.1:8082/internal/hello', {headers: {'x-user': req.session.internal}})
  .then(({data}) => {
    res.json({
      messages: [
        "Hello from our API1! " + req.session?.traits?.email,
        ...data.messages
      ]
    });
  })

})

const port = process.env.PORT || 8081
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
