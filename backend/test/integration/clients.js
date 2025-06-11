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

describe("Clients Routes", function () {
  let client
  const clientObject = {
    type: "object",
    required: [
      "id",
      "workId",
      "fullname",
      "address",
      "phoneNumber",
      "description",
      "createdAt",
      "updatedAt",
      "work",
      "tickets",
    ],
    properties: {
      work: {
        type: "object",
        require: ["id", "name", "address", "createdAt", "updatedAt"],
      },
      tickets: {
        type: "array",
        items: {
          type: "object",
          required: [
            "id",
            "clientId",
            "cost",
            "paymentPlan",
            "description",
            "createdAt",
            "updatedAt",
            "paid",
            "returned",
            "owed",
          ],
        },
      },
    },
  }

  const clientSchema = {
    title: "Client schema",
    ...clientObject,
  }

  const clientsSchema = {
    title: "Clients Schema",
    type: "array",
    items: {
      ...clientObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:clientId", function () {
    it("When an existing client id is given, Then the response is the client", async function () {
      const clientId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get("/clients/" + clientId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(clientSchema)
    })

    it("When an non-existing client id is given, Then the response is not found #paramClientId", async function () {
      const clientId = Math.ceil(Math.random() * 10) + 4

      const { status, data } = await client.get("/clients/" + clientId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Client not found.")
    })

    it("When client id given is not an integer, Then the response is not found #integerValidator #paramClientId", async function () {
      const clientId = "string"

      const { status, data } = await client.get("/clients/" + clientId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allClients = [
      {
        id: 4,
        workId: 3,
        fullname: "Madilyn Langosh",
        address: "1571 Weekly Street",
        phoneNumber: "2103424367",
        description: "",
        createdAt: "2025-01-13T00:00:00.000Z",
        updatedAt: "2025-01-13T00:00:00.000Z",
        tickets: [
          {
            id: 3,
            clientId: 4,
            cost: 168.27,
            paymentPlan: "lump sum",
            description: "",
            soldAt: "2025-01-13T00:00:00.000Z",
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
            returned: 155,
            paid: 13.27,
            owed: 0,
          },
        ],
        work: {
          id: 3,
          name: "Lynch PLC",
          address: "38 Lafayette St.",
          phoneNumber: "9103623505",
          createdAt: "2025-01-13T00:00:00.000Z",
          updatedAt: "2025-01-13T00:00:00.000Z",
        },
      },
      {
        id: 3,
        workId: 2,
        fullname: "Kellen Paucek",
        address: "1454 Sussex Court",
        phoneNumber: "2543865553",
        description: "",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        tickets: [
          {
            id: 2,
            clientId: 3,
            cost: 488.52,
            paymentPlan: "biweekly",
            description: "",
            soldAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            returned: 0,
            paid: 200,
            owed: 288.52,
          },
        ],
        work: {
          id: 2,
          name: "Deckow and Sons",
          address: "245 John Drive",
          phoneNumber: "7644084620",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 2,
        workId: 1,
        fullname: "James Moe",
        address: "1823 Steele Street",
        phoneNumber: "9566347775",
        description: "",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        tickets: [
          {
            id: 1,
            clientId: 2,
            cost: 391.9,
            paymentPlan: "weekly",
            description: "",
            soldAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            returned: 155,
            paid: 236.9,
            owed: 0,
          },
        ],
        work: {
          id: 1,
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 1,
        workId: 1,
        fullname: "Defective",
        address: "0000 Street",
        phoneNumber: "0000000000",
        description: "",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        tickets: [],
        work: {
          id: 1,
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
    ]

    async function getClientsIt(
      requestBody,
      expectedClients = [],
      isPrinted = false
    ) {
      expectedClients = Array.isArray(expectedClients)
        ? expectedClients
        : [expectedClients]

      const { status, data: clients } = await client.post(
        "/clients/search",
        requestBody
      )

      if (isPrinted) {
        for (const client of clients) {
          console.log(client, ",")
        }
      }

      expect(status).to.equal(OK)
      expect(clients).to.be.jsonSchema(clientsSchema)
      expect(clients).to.eql(expectedClients)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getClientsIt({}, allClients)
    })

    it("When work id is the only input, Then response all clients with the same work id", async function () {
      await getClientsIt({ workId: 3 }, allClients[0])
    })

    it("When a createdAt date object is given, Then response is all clients within that same month and year", async function () {
      await getClientsIt({ createdAt: { year: 2025, month: 0 } }, allClients)
    })

    it("When a updatedAt date string is given, Then response is all clients within that same month and year", async function () {
      await getClientsIt({ updatedAt: "2025-02-01T12:00:00.000Z" })
    })

    it("When part of a fullname is given, Then response is all clients that include the given string using case insensitive search", async function () {
      await getClientsIt({ fullname: "ADI" }, allClients[0])
    })

    it("When part of an address is given, Then response is all clients that include the given string using case insensitive search", async function () {
      await getClientsIt({ address: "TEEL" }, allClients[2])
    })

    it("When part of a phone number is given, Then response is all clients that include the given string using case insensitive search", async function () {
      await getClientsIt({ phoneNumber: "3424" }, allClients[0])
    })

    it("When multiple inputs are given, Then response is all clients that satisfy the input comparisons", async function () {
      await getClientsIt(
        {
          workId: 2,
          fullname: "Pau",
          address: "1454",
          phoneNumber: "2543865553",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
        allClients[1]
      )
    })
  })

  describe("Post /", function () {
    it("When user inputs required values, Then client is created ", async function () {
      const requestBody = {
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        workId: Math.ceil(Math.random() * 3),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.post("/clients", requestBody)

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const newClientSearched = await models.Clients.findOne({
        where: requestBody,
      })
      const newClient = newClientSearched.dataValues
      const newClientDeleted = await models.Clients.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" client has been created.")
      expect(newClient).to.include(requestBody)
      expect(newClientDeleted).to.equal(1)
    })

    it("When user inputs required values and a new work are given, Then the new work is created then the client is created ", async function () {
      const work = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }
      const requestBody = {
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        work,
      }

      const { status, data } = await client.post("/clients", requestBody)

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      delete requestBody.work
      work.phoneNumber = work.phoneNumber.replace(/\D/g, "")
      const newClientSearched = await models.Clients.findOne({
        where: requestBody,
      })
      const newClient = newClientSearched.dataValues
      const newClientDeleted = await models.Clients.destroy({
        where: requestBody,
      })
      const newWorkSearched = await models.Works.findOne({
        where: work,
      })
      const newWork = newWorkSearched.dataValues
      const newWorkDeleted = await models.Works.destroy({
        where: work,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" client has been created.")
      expect(newClient).to.include(requestBody)
      expect(newClientDeleted).to.equal(1)
      expect(newWork).to.include(work)
      expect(newWorkDeleted).to.equal(1)
    })

    it("When user inputs required values and an invalid new work are given, Then response is bad request ", async function () {
      const work = {
        name: faker.company.name(),
        address: Math.random() * 20,
        phoneNumber: fakerPhoneNumber(),
      }
      const requestBody = {
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        work,
      }

      const { status, data } = await client.post("/clients", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Put /:clientId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const clientId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put(
        "/clients/" + clientId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then client has the respective information updated", async function () {
      const newClient = {
        workId: Math.ceil(Math.random() * 3),
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      }
      const clientBeforeCreated = await models.Clients.create(newClient)
      const clientBefore = clientBeforeCreated.dataValues
      const clientId = clientBefore.id
      const requestBody = {
        workId: Math.ceil(Math.random() * 3),
        fullname: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        description: faker.lorem.sentence({ min: 3, max: 10 }),
      }

      const { status, data } = await client.put(
        "/clients/" + clientId,
        requestBody
      )

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const clientAfterSearched = await models.Clients.findOne({
        where: { id: clientId },
      })
      const clientAfter = clientAfterSearched.dataValues
      const clientDeleted = await models.Clients.destroy({
        where: { id: clientId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` client with id = ${clientId} was updated`)
      expect(clientAfter).to.include(requestBody)
      expect(new Date(clientBefore.updatedAt)).to.be.beforeTime(
        new Date(clientAfter.updatedAt)
      )
      expect(clientDeleted).to.equal(1)
    })
  })

  describe("Delete /:clientId", function () {
    it("When taget client id exists, Then respective client is deleted ", async function () {
      const clientCreated = await models.Clients.create({
        fullname: "client name",
        workId: "3",
        address: "0000 address",
        phoneNumber: "7531234567",
      })
      const newClient = clientCreated.dataValues
      const clientId = newClient.id

      const { status, data } = await client.delete("/clients/" + clientId)

      const afterClientSearched = await models.Clients.findOne({
        where: { id: clientId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a client with id = ${clientId} and fullname = ${newClient.fullname}.`
        )
      expect(afterClientSearched).to.equal(null)
    })
  })
})
