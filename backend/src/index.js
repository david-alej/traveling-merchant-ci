const { logError, isOperationalError } =
  require("./controllers/index").errorHandlers

process.on("unhandledRejection", (err) => {
  throw err
})

process.on("uncaughtException", (err) => {
  logError(err)

  if (!isOperationalError(err)) {
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
})

const app = require("./server")

require("dotenv").config()

let server = ""

const initializeWebServer = () => {
  return new Promise((resolve) => {
    let PORT = process.env.PORT || 3000

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

if (!process.env.CI_BACKEND) {
  initializeWebServer()
}

module.exports = { initializeWebServer, stopWebServer }
