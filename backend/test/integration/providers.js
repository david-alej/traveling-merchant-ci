const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  faker,
  fakerPhoneNumber,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("Providers Routes", function () {
  let client
  const providerObject = {
    type: "object",
    required: [
      "id",
      "name",
      "address",
      "email",
      "createdAt",
      "updatedAt",
      "orders",
    ],
    properties: {
      orders: {
        type: "array",
        items: {
          type: "object",
          required: [
            "id",
            "providerId",
            "cost",
            "tax",
            "shipment",
            "expectedAt",
            "actualAt",
          ],
        },
      },
    },
  }

  const providerSchema = {
    title: "Provider schema",
    ...providerObject,
  }

  const providersSchema = {
    title: "Providers Schema",
    type: "array",
    items: {
      ...providerObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:providerId", function () {
    it("When an existing provider id is given, Then the response is the provider", async function () {
      const providerId = Math.ceil(Math.random() * 2)

      const { status, data } = await client.get("/providers/" + providerId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(providerSchema)
    })

    it("When an non-existing provider id is given, Then the response is not found #paramProviderId", async function () {
      const providerId = Math.ceil(Math.random() * 10) + 4

      const { status, data } = await client.get("/providers/" + providerId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Provider not found.")
    })

    it("When provider id given is not an integer, Then the response is not found #integerValidator #paramProviderId", async function () {
      const providerId = "string"

      const { status, data } = await client.get("/providers/" + providerId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allProviders = [
      {
        id: 2,
        name: "Ebay",
        address: "0000 online",
        phoneNumber: "5125869601",
        email: "",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        orders: [
          {
            id: 2,
            providerId: 2,
            cost: 959.59,
            tax: 89.59,
            shipment: 20,
            expectedAt: "2025-01-09T00:00:00.000Z",
            actualAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-17T00:00:00.000Z",
          },
        ],
      },
      {
        id: 1,
        name: "Amazon",
        address: "0000 online",
        phoneNumber: "1632474734",
        email: "derick_kertzmann@amazon.support.com",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        orders: [
          {
            id: 1,
            providerId: 1,
            cost: 3413.65,
            tax: 283.65,
            shipment: 50,
            expectedAt: "2025-01-08T00:00:00.000Z",
            actualAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
      },
    ]

    async function getProvidersIt(
      requestBody,
      expectedProviders = [],
      isPrinted = false
    ) {
      expectedProviders = Array.isArray(expectedProviders)
        ? expectedProviders
        : [expectedProviders]

      const { status, data: providers } = await client.post(
        "/providers/search",
        requestBody
      )

      if (isPrinted) {
        console.log("[")

        for (const provider of providers) console.log(provider, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(providers).to.be.jsonSchema(providersSchema)
      expect(providers).to.eql(expectedProviders)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getProvidersIt({}, allProviders)
    })

    it("When name is the only input, Then response all providers with the a name that includes the subtring entered", async function () {
      await getProvidersIt({ name: "ebay" }, allProviders[0])
    })

    it("When address is the only input, Then response all providers with the a address that includes the subtring entered", async function () {
      await getProvidersIt({ address: "0 on" }, allProviders)
    })

    it("When a valid and full phone number is the only input, Then response all providers with the given phone number", async function () {
      await getProvidersIt({ phoneNumber: "1632474734" }, allProviders[1])
    })

    it("When email is the only input, Then response all providers with the a email that includes the subtring entered", async function () {
      await getProvidersIt({ email: "amazon.support" }, allProviders[1])
    })

    it("When a createdAt date object is given, Then response is all providers within that same month and year", async function () {
      await getProvidersIt(
        { createdAt: { year: 2025, month: 0 } },
        allProviders
      )
    })

    it("When a updatedAt date string is given, Then response is all providers with the exact date up to the hour", async function () {
      await getProvidersIt({ updatedAt: new Date("2024-12-11") })
    })

    it("When multiple inputs are given, Then response is all providers that satisfy the input comparisons", async function () {
      await getProvidersIt(
        {
          name: "bay",
          address: "0000",
          phoneNumber: "5125869601",
          email: "",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
        allProviders[0]
      )
    })
  })

  describe("Post /", function () {
    it("When user inputs required values, Then provider is created ", async function () {
      const requestBody = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        email: "elvis88@hotmail.com",
      }

      const { status, data } = await client.post("/providers", requestBody)

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const newProviderSearched = await models.Providers.findOne({
        where: requestBody,
      })
      const newProvider = newProviderSearched.dataValues
      const newProviderDeleted = await models.Providers.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" provider has been created.")
      expect(newProvider).to.include(requestBody)
      expect(newProviderDeleted).to.equal(1)
    })
  })

  describe("Put /:providerId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const providerId = Math.ceil(Math.random() * 2)
      const requestBody = {}

      const { status, data } = await client.put(
        "/providers/" + providerId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then provider has the respective information updated", async function () {
      const newProvider = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
        email: faker.internet.email(),
      }
      const providerBeforeCreated = await models.Providers.create(newProvider)
      const providerBefore = providerBeforeCreated.dataValues
      const providerId = providerBefore.id
      const requestBody = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.put(
        "/providers/" + providerId,
        requestBody
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      delete requestBody.email
      const providerAfterSearched = await models.Providers.findOne({
        where: { id: providerId },
      })
      const providerAfter = providerAfterSearched.dataValues
      const providerDeleted = await models.Providers.destroy({
        where: { id: providerId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` provider with id = ${providerId} was updated`)
      expect(providerAfter).to.include(requestBody)
      expect(new Date(providerBefore.updatedAt)).to.be.beforeTime(
        new Date(providerAfter.updatedAt)
      )
      expect(providerDeleted).to.equal(1)
    })
  })

  describe("Delete /:providerId", function () {
    it("When taget provider id exists, Then respective provider is deleted ", async function () {
      const providerCreated = await models.Providers.create({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      })
      const newProvider = providerCreated.dataValues
      const providerId = newProvider.id

      const { status, data } = await client.delete("/providers/" + providerId)

      const afterProviderSearched = await models.Providers.findOne({
        where: { id: providerId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a provider with id = ${providerId} and name = ${newProvider.name}.`
        )
      expect(afterProviderSearched).to.equal(null)
    })
  })
})
