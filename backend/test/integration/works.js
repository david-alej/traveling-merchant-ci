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

describe("Works Routes", function () {
  let client
  const workObject = {
    type: "object",
    required: [
      "id",
      "name",
      "address",
      "phoneNumber",
      "createdAt",
      "updatedAt",
      "clients",
    ],
    properties: {
      clients: {
        type: "array",
        items: {
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
          ],
        },
      },
    },
  }

  const workSchema = {
    title: "Work schema",
    ...workObject,
  }

  const worksSchema = {
    title: "Works Schema",
    type: "array",
    items: {
      ...workObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:workId", function () {
    it("When an existing work id is given, Then the response is the work", async function () {
      const workId = Math.ceil(Math.random() * 3)

      const { status, data } = await client.get("/works/" + workId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(workSchema)
    })

    it("When an non-existing work id is given, Then the response is not found #paramWorkId", async function () {
      const workId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get("/works/" + workId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Work not found.")
    })

    it("When work id given is not an integer, Then the response is not found #integerValidator #paramWorkId", async function () {
      const workId = "string"

      const { status, data } = await client.get("/works/" + workId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allWorks = [
      {
        id: 3,
        name: "Lynch PLC",
        address: "38 Lafayette St.",
        phoneNumber: "9103623505",
        createdAt: "2025-01-13T00:00:00.000Z",
        updatedAt: "2025-01-13T00:00:00.000Z",
        clients: [
          {
            id: 4,
            workId: 3,
            fullname: "Madilyn Langosh",
            address: "1571 Weekly Street",
            phoneNumber: "2103424367",
            description: "",
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
          },
        ],
      },
      {
        id: 2,
        name: "Deckow and Sons",
        address: "245 John Drive",
        phoneNumber: "7644084620",
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        clients: [
          {
            id: 3,
            workId: 2,
            fullname: "Kellen Paucek",
            address: "1454 Sussex Court",
            phoneNumber: "2543865553",
            description: "",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
      },
      {
        id: 1,
        name: "Hamill, Denesik and Davis",
        address: "38 Galvin Ave.",
        phoneNumber: "9075554011",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        clients: [
          {
            id: 2,
            workId: 1,
            fullname: "James Moe",
            address: "1823 Steele Street",
            phoneNumber: "9566347775",
            description: "",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
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
          },
        ],
      },
    ]

    async function getWorksIt(
      requestBody,
      expectedWorks = [],
      isPrinted = false
    ) {
      expectedWorks = Array.isArray(expectedWorks)
        ? expectedWorks
        : [expectedWorks]

      const { status, data: works } = await client.post(
        "/works/search",
        requestBody
      )

      if (isPrinted) {
        for (const work of works) {
          console.log(work, ",")
        }
      }

      expect(status).to.equal(OK)
      expect(works).to.be.jsonSchema(worksSchema)
      expect(works).to.eql(expectedWorks)
    }

    it("When no inputs are given, Then all works are returned", async function () {
      await getWorksIt({}, allWorks)
    })

    it("When a updatedAt date object is given, Then response is all clients within that same month and year", async function () {
      await getWorksIt({ updatedAt: { year: 2025, month: 0 } }, allWorks)
    })

    it("When a name is given, Then all works that have their names include the given string using case insensitive search", async function () {
      await getWorksIt({ name: "de" }, [allWorks[1], allWorks[2]])
    })

    it("When a address is given, Then all works that have their address include the given string using case insensitive search are returned", async function () {
      await getWorksIt({ address: "gal" }, allWorks[2])
    })

    it("When a phone number is given, Then all works that have their address include the given string using case insensitive search are returned", async function () {
      await getWorksIt({ phoneNumber: "10362" }, allWorks[0])
    })

    it("When address and name are given, Then respective works that match the strings inclusions are returned", async function () {
      await getWorksIt({ name: "de", address: "38" }, allWorks[2])
    })
  })

  describe("Post /", function () {
    it("When required inputs are given, Then work is created", async function () {
      const requestBody = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.post("/works", requestBody)

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const newWorkSearched = await models.Works.findOne({
        where: requestBody,
      })
      const newWork = newWorkSearched.dataValues
      const newWorkDeleted = await models.Works.destroy({ where: requestBody })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" work has been created.")
      expect(newWork).to.include(requestBody)
      expect(newWorkDeleted).to.equal(1)
    })
  })

  describe("Put /:workId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const workId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put("/works/" + workId, requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then work has the respective information updated", async function () {
      const newWork = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber().replace(/\D/g, ""),
      }
      const workBeforeCreated = await models.Works.create(newWork)
      const workBefore = workBeforeCreated.dataValues
      const workId = workBefore.id
      const requestBody = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      }

      const { status, data } = await client.put("/Works/" + workId, requestBody)

      requestBody.phoneNumber = requestBody.phoneNumber.replace(/\D/g, "")
      const workAfterSearched = await models.Works.findOne({
        where: { id: workId },
      })
      const workAfter = workAfterSearched.dataValues
      const workDeleted = await models.Works.destroy({
        where: { id: workId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` work with id = ${workId} was updated`)
      expect(workAfter).to.include(requestBody)
      expect(new Date(workBefore.updatedAt)).to.be.beforeTime(
        new Date(workAfter.updatedAt)
      )
      expect(workDeleted).to.equal(1)
    })
  })

  describe("Delete /:workId", function () {
    it("When taget work id exists, Then respective work is deleted ", async function () {
      const workCreated = await models.Works.create({
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
      })
      const newWork = workCreated.dataValues
      const workId = newWork.id

      const { status, data } = await client.delete("/works/" + workId)

      const afterWorkSearched = await models.Works.findOne({
        where: { id: workId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a work with id = ${workId} and name = ${newWork.name}.`
        )
      expect(afterWorkSearched).to.equal(null)
    })
  })
})
