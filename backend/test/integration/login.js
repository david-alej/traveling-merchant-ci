const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  merchantCredentials,
  fakerUsername,
  fakerPassword,
  startClient,
} = require("../common")

const { OK, UNAUTHORIZED } = httpStatusCodes

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe("Login routes", function () {
  let client

  before(async function () {
    client = await startClient()
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

  describe("Post / Rate limiting", function () {
    const durationInSeconds = 1

    it("Waited a second before first test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with wrong username and password one more time than is allowed, 100 times, in less than the duration, Then response is a too many request ", async function () {
      const iterations = 101
      const wrongUsernameCredentials = {
        username: fakerUsername(),
        password: fakerPassword(),
      }
      const results = []

      for (let i = 0; i < iterations; i++) {
        const res = await client.post("/login", wrongUsernameCredentials)

        results.push(res)
      }
      const lastResult = results.pop()
      const allResultsBeforeLastResultAreUndefined = results.every(
        (value) => value.status === 401
      )

      expect(allResultsBeforeLastResultAreUndefined).is.true
      expect(lastResult.status).to.equal(429)
      expect(lastResult.data).to.equal("Too many requests.")
    })

    it("Waited a second before second test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with wrong username and password after already getting an 429 error, Then response is a too many request ", async function () {
      const iterations = 102
      const wrongUsernameCredentials = {
        username: fakerUsername(),
        password: fakerPassword(),
      }
      let lastResult

      for (let i = 0; i < iterations; i++) {
        lastResult = await client.post("/login", wrongUsernameCredentials)
      }

      expect(lastResult.status).to.equal(429)
      expect(lastResult.data).to.equal("Too many requests.")
    })

    it("Waited a second before third test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with right username and wrong password one more time than is allowed, 10 times, in less than the duration, Then response is a too many request ", async function () {
      const iterations = 11
      const wrongUsernameCredentials = {
        username: merchantCredentials.username,
        password: fakerPassword(),
      }
      const results = []

      for (let i = 0; i < iterations; i++) {
        const res = await client.post("/login", wrongUsernameCredentials)

        results.push(res)
      }

      const lastResult = results.pop()
      const allResultsBeforeLastResultAreUndefined = results.every(
        (value) => value.status === 401
      )

      expect(lastResult.status).to.equal(429)
      expect(lastResult.data).to.equal("Too many requests.")
      expect(allResultsBeforeLastResultAreUndefined).is.true
    })

    it("Waited a second before fourth test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with right username and wrong password after already getting an 429 error, Then response is a too many request ", async function () {
      const iterations = 12
      const wrongUsernameCredentials = {
        username: merchantCredentials.username,
        password: fakerPassword(),
      }
      let lastResult

      for (let i = 0; i < iterations; i++) {
        lastResult = await client.post("/login", wrongUsernameCredentials)
      }

      expect(lastResult.status).to.equal(429)
      expect(lastResult.data).to.equal("Too many requests.")
    })

    it("Waited a second before fith test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client logs in using right username and wrong password more than half of the allowed tries per duration, logs in succesfully, and logs in with the using right username and wrong password more than half of the allowed tries per duration, Then allowed tries is reset when user logged in correctly thus resulting in never returing a too many request response ", async function () {
      const iterations = 6
      const wrongUsernameCredentials = {
        username: merchantCredentials.username,
        password: fakerPassword(),
      }
      const results = []

      for (let i = 0; i < iterations; i++) {
        const res = await client.post("/login", wrongUsernameCredentials)

        results.push(res)
      }

      const correctLoginResponse = await client.post(
        "/login",
        merchantCredentials
      )

      for (let i = 0; i < iterations; i++) {
        const res = await client.post("/login", wrongUsernameCredentials)

        results.push(res)
      }
      const allWrongResponsesAre401Error = results.every((value) => {
        return value.status === 401
      })

      expect(correctLoginResponse.status).to.equal(200)
      expect(correctLoginResponse.data.csrfToken).to.be.a("string")
      expect(allWrongResponsesAre401Error).to.be.true
    })
  })
})
