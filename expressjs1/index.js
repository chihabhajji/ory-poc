const express = require("express")
const cors = require("cors")
const { FrontendApi, Configuration } = require("@ory/client")
const axios = require("axios")
const app = express()


// const ory = new FrontendApi(new Configuration({
//     basePath: process.env.ORY_URL || "http://127.0.0.1:4455",
//     baseOptions: { withCredentials: true },
// }))

// app.use(cors({
//   origin: "http://127.0.0.1:3000",
//   credentials: true, // <- Required for CORS to accept cookies and tokens.
// }))

app.get("/hello", (req, res) => {
  console.log(req)
  axios.get("http://express2:8082/hello")
    .then(({ data }) => res.json({
      message1: "Hello from our API1!",
      message2: "And also, " + data.message,
      session: req.session
    }))
    .catch(error => res.status(400).json(error));
})

const port = process.env.PORT || 8081
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
