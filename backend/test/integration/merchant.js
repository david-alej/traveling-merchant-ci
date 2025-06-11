const {
  expect,
  httpStatusCodes,
  merchantCredentials,
  preMerchantMsg,
  fakerUsername,
  fakerPassword,
  models,
  initializeClient,
} = require("../common")

const { OK, BAD_REQUEST, NOT_FOUND } = httpStatusCodes

const { passwordHash } = require("../../src/util/index").passwordHash

describe("Merchant routes", function () {
  let client

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /", function () {
    it("When non existing is input, then response is not found ", async function () {
      const { status, data } = await client.get("/merchant/100")

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.eql("Merchant not found.")
    })

    it("When valid request is made, then status is ok", async function () {
      const expected = {
        id: 1,
        username: "missioneros",
        createdAt: "2024-11-11T00:00:00.000Z",
      }

      const { status, data } = await client.get("/merchant/1")

      expect(status).to.equal(OK)
      expect(data).to.include(expected)
    })
  })

  describe("Put /", function () {
    const putUserNewCredentials = {}

    beforeEach(async function () {
      putUserNewCredentials.newUsername = fakerUsername()
      putUserNewCredentials.newPassword = fakerPassword()

      const { status } = await client.post("/login", merchantCredentials)

      expect(status).to.equal(OK)
    })

    it("When no new credentials are added, then response is a bad request", async function () {
      const expected = "Bad request."
      const requestBody = merchantCredentials
      const merchantId = 1

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal(expected)
    })

    it("When a new username is entered but it already exists, then response is a bad request", async function () {
      const requestBody = {
        ...merchantCredentials,
        newUsername: merchantCredentials.username,
      }
      const expected = "Bad request."
      const merchantId = 1

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal(expected)
    })

    it("When a valid new username is provided, then response is ok", async function () {
      const { password } = merchantCredentials
      const { newUsername } = putUserNewCredentials
      const requestBody = { ...merchantCredentials, newUsername }
      const afterMsg = " has updated either/both their username or password."
      const merchantId = 1

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody
      )

      const { status: newCredentialsLoginStatus } = await client.post(
        "/login",
        {
          username: newUsername,
          password: password,
        }
      )
      const updated = await models.Merchant.update(
        { username: merchantCredentials.username },
        {
          where: { id: merchantId },
        }
      )

      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(newCredentialsLoginStatus).to.equal(OK)
      expect(updated[0]).to.equal(1)
    })

    it("When a valid new password is provided, then response is ok", async function () {
      const { username } = merchantCredentials
      const { newPassword } = putUserNewCredentials
      const requestBody = { ...merchantCredentials, newPassword }
      const { status: firstSearchStatus, data: oldMerchantData } =
        await client.get("/merchant/1")
      const oldUpdatedAt = oldMerchantData.updatedAt
      const merchantId = 1
      const afterMsg = " has updated either/both their username or password."

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody
      )

      const { status: loginStatus } = await client.post("/login", {
        username: username,
        password: newPassword,
      })

      const hashedPassword = await passwordHash(
        merchantCredentials.password,
        10
      )
      const updated = await models.Merchant.update(
        {
          username: merchantCredentials.username,
          password: hashedPassword,
        },
        {
          where: { id: merchantId },
        }
      )
      const { status: searchStatus, data: newMerchantData } = await client.get(
        "/merchant/" + merchantId
      )
      const newUpdatedAt = newMerchantData.updatedAt

      expect(firstSearchStatus).to.equal(OK)
      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(loginStatus).to.equal(OK)
      expect(updated[0]).to.equal(1)
      expect(searchStatus).to.equal(OK)
      expect(new Date(newUpdatedAt)).to.be.afterTime(new Date(oldUpdatedAt))
    })

    it("When both new credentials are added and valid, then response is ok", async function () {
      const { newUsername, newPassword } = putUserNewCredentials
      const requestBody = {
        ...merchantCredentials,
        newUsername,
        newPassword,
      }
      const merchantId = 1
      const afterMsg = " has updated either/both their username or password."

      const { status, data } = await client.put(
        "/merchant/" + merchantId,
        requestBody
      )

      const { status: status1 } = await client.post("/login", {
        username: newUsername,
        password: newPassword,
      })

      const hashedPassword = await passwordHash(
        merchantCredentials.password,
        10
      )
      const updated = await models.Merchant.update(
        {
          username: merchantCredentials.username,
          password: hashedPassword,
        },
        {
          where: { id: merchantId },
        }
      )

      expect(status).to.equal(OK)
      expect(data).to.include.string(preMerchantMsg).and.string(afterMsg)
      expect(status1).to.equal(OK)
      expect(updated[0]).to.equal(1)
    })
  })
})
