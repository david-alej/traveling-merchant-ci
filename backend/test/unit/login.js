const {
  expect,
  fakerUsername,
  fakerPassword,
  httpMocks,
  merchantCredentials,
} = require("../common")

const { postLogin } = require("../../src/controllers/index").loginControllers
const { Api401Error, Api429Error } = require("../../src/util/index").apiErrors

const { createResponse, createRequest } = httpMocks

require("dotenv").config()

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe("Rate Limiters Controllers (Beware test suite will take long due to testing limiter duration)", function () {
  const durationInSeconds = 1
  let res, nextReturn
  const next = (value) => (nextReturn = value)

  beforeEach(function () {
    res = createResponse()
  })

  describe("Login Route .postLogin", function () {
    it("When client tries to login with wrong username and password one more time than is allowed, 100 times, in less than the duration, Then response is a too many request ", async function () {
      const iterations = 101
      const username = fakerUsername()
      const password = fakerPassword()
      const req = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password,
        },
        session: {},
      })
      const results = []

      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)

        results.push(nextReturn)
      }
      const lastResult = results.pop()
      const allResultsBeforeLastResultAreUndefined = results.every(
        (value) => value instanceof Api401Error
      )

      expect(lastResult).to.be.an.instanceOf(Api429Error)
      expect(lastResult.description).to.equal(
        "Client: has made to many request to the original url, /login, next retry is after 1 seconds."
      )
      expect(allResultsBeforeLastResultAreUndefined).is.true
    })

    it("Waited a second before second test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with wrong username and password after already getting an 429 error, Then response is a too many request ", async function () {
      const iterations = 102
      const username = fakerUsername()
      const password = fakerPassword()
      const req = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password,
        },
        session: {},
      })

      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)
      }
      const lastResult = nextReturn

      expect(lastResult).to.be.an.instanceOf(Api429Error)
      expect(lastResult.description).to.equal(
        "Client: has made to many request to the original url, /login, next retry is after 1 seconds."
      )
    })

    it("Waited a second before third test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with right username and wrong password one more time than is allowed, 10 times, in less than the duration, Then response is a too many request ", async function () {
      const iterations = 11
      const username = merchantCredentials.username
      const req = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password: "wrongPassword1",
        },
        session: {},
      })
      const results = []

      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)

        results.push(nextReturn)
      }
      const lastResult = results.pop()
      const allResultsBeforeLastResultAreUndefined = results.every(
        (value) => value instanceof Api401Error
      )

      expect(lastResult).to.be.an.instanceOf(Api429Error)
      expect(lastResult.description).to.equal(
        "Client: has made to many request to the original url, /login, next retry is after 1 seconds."
      )
      expect(allResultsBeforeLastResultAreUndefined).is.true
    })

    it("Waited a second before fourth test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client tries to login with right username and wrong password after already getting an 429 error, Then response is a too many request ", async function () {
      const iterations = 12
      const username = merchantCredentials.username
      const req = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password: "wrongPassword1",
        },
        session: {},
      })

      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)
      }
      const lastResult = nextReturn

      expect(lastResult).to.be.an.instanceOf(Api429Error)
      expect(lastResult.description).to.equal(
        "Client: has made to many request to the original url, /login, next retry is after 1 seconds."
      )
    })

    it("Waited a second before fith test", async function () {
      this.timeout(1000 * durationInSeconds + 10)
      await wait(1000 * durationInSeconds)
    })

    it("When client logs in using right username and wrong password more than half of the allowed tries per duration, logs in succesfully, and logs in with the using right username and wrong password more than half of the allowed tries per duration, Then allowed tries is reset when user logged in correctly thus resulting in never returing a too many request response ", async function () {
      const iterations = 6
      const username = merchantCredentials.username
      const password = merchantCredentials.password
      const req = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password: "wrongPassword1",
        },
        session: {},
      })
      const correctReq = createRequest({
        method: "PUT",
        originalUrl: "/login",
        ip: "localhost",
        body: {
          username,
          password,
        },
        session: {},
        signedCookies: { "__Host-psifi": { "x-csrf-token": "" } },
      })
      const results = []
      const merchantId = 1

      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)

        results.push(nextReturn)
      }
      await postLogin(correctReq, res, next)
      const correctLoginResponse = await res._getData()
      for (let i = 0; i < iterations; i++) {
        await postLogin(req, res, next)

        results.push(nextReturn)
      }
      const allWrongResponsesAre401Error = results.every((value) => {
        return value instanceof Api401Error
      })

      expect(correctLoginResponse.message).to.equal(
        `Merchant: ${merchantId} is now logged in.`
      )
      expect(correctLoginResponse.csrfToken).to.be.a("string")
      expect(allWrongResponsesAre401Error).to.be.true
    })
  })
})
