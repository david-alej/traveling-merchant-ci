const {
  expect,
  httpStatusCodes,
  stopWebServer,
  initializeClient,
} = require("../common")

const { OK } = httpStatusCodes

describe("Starting page", function () {
  let client

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  after(async function () {
    await stopWebServer()
  })

  describe("Get /", function () {
    it("When request is made for the starting page, then response is ok with a message", async function () {
      const expected = "Welcome and rest fellow traveler!!"

      const { data, status } = await client.get("/")

      expect(status).to.equal(OK)
      expect(data).to.equal(expected)
    })
  })
})
