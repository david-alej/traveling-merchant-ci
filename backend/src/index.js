const app = require("./server")

require("dotenv").config()

let server = ""

const initializeWebServer = () => {
  return new Promise((resolve) => {
    let PORT = process.env.PORT || 3000

    if (process.env.NODE_ENV === "test" && !process.env.CI_BACKEND) {
      PORT = 0
    }

    server = app.listen(PORT, () => {
      const address = server.address()

      console.log(`Server is listening at port: ${address.port}`)
      console.log("Swagger-ui is available on /api-docs endpoint")

      resolve(address)
    })
  })
}

const stopWebServer = () => {
  return new Promise((resolve) => {
    server.close(() => {
      resolve()
    })
  })
}

if (process.env.NODE_ENV !== "test") initializeWebServer()

module.exports = { initializeWebServer, stopWebServer }
