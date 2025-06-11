const { stopWebServer } = require("./common")

describe("Ending tests", function () {
  before(async function () {
    await stopWebServer()
  })
})
