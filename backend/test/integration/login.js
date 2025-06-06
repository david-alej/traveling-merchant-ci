const {
  axios,
  axiosConfig,
  initializeWebServer,
  stopWebServer,
  expect,
  httpStatusCodes,
  preMerchantMsg,
  merchantCredentials,
} = require("../common")

const { OK, UNAUTHORIZED } = httpStatusCodes

describe("Login routes", function () {
  let client

  before(async function () {
    const apiConnection = await initializeWebServer()

    const currentAxiosConfig = { ...axiosConfig }

    currentAxiosConfig.baseURL += apiConnection.port

    client = axios.create(currentAxiosConfig)
  })

  after(async function () {
    await stopWebServer()
  })

  describe("Post /", function () {
    it("When username that does not exist, then response is an unauthorized #usernameExists #authenticate", async function () {
      const expected = "Unauthorized."
      const wrongUsernameCredentials = {
        username: "wrongUsername",
        password: merchantCredentials.password,
      }

      const { data, status } = await client.post(
        "/login",
        wrongUsernameCredentials
      )

      expect(status).to.equal(UNAUTHORIZED)
      expect(data).to.equal(expected)
    })

    it("When password does not match existing password, then response is unauthorized #correctPassword #authenticate", async function () {
      const expected = "Unauthorized."
      const wrongPasswordCredentials = {
        username: merchantCredentials.username,
        password: "wrongPassword0",
      }

      const { status, data } = await client.post(
        "/login",
        wrongPasswordCredentials
      )

      expect(status).to.equal(UNAUTHORIZED)
      expect(data).to.equal(expected)
    })

    it("When authentication works, then user is logged in #authenticate", async function () {
      const afterMsg = " is now logged in."

      const { status, data } = await client.post("/login", merchantCredentials)

      expect(status).to.equal(OK)
      expect(data.message)
        .to.include.all.string(preMerchantMsg)
        .and.string(afterMsg)
    })
  })
})
