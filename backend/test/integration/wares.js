const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  round,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("Wares Routes", function () {
  let client
  const wareObject = {
    type: "object",
    required: [
      "id",
      "name",
      "type",
      "tags",
      "unitPrice",
      "createdAt",
      "updatedAt",
      "ordersWares",
      "waresTickets",
      "stock",
    ],
    properties: {
      ordersWares: {
        type: "array",
        items: {
          type: "object",
          required: [
            "wareId",
            "orderId",
            "amount",
            "unitPrice",
            "returned",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      waresTickets: {
        type: "array",
        items: {
          type: "object",
          required: [
            "wareId",
            "ticketId",
            "amount",
            "returned",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  }

  const wareSchema = {
    title: "Ware schema",
    ...wareObject,
  }

  const waresSchema = {
    title: "Wares Schema",
    type: "array",
    items: {
      ...wareObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:wareId", function () {
    it("When an existing ware id is given, Then the response is the ware", async function () {
      const wareId = Math.ceil(Math.random() * 5)

      const { status, data } = await client.get("/wares/" + wareId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(wareSchema)
    })

    it("When an non-existing ware id is given, Then the response is not found #paramWareId", async function () {
      const wareId = Math.ceil(Math.random() * 10) + 5

      const { status, data } = await client.get("/wares/" + wareId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ware not found.")
    })

    it("When ware id given is not an integer, Then the response is not found #integerValidator #paramWareId", async function () {
      const wareId = "string"

      const { status, data } = await client.get("/wares/" + wareId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allWares = [
      {
        id: 5,
        name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
        type: "braclet",
        tags: ["unisex"],
        unitPrice: 14,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        stock: 8,
        ordersWares: [
          {
            id: 5,
            wareId: 5,
            orderId: 2,
            unitPrice: 10,
            amount: 10,
            returned: 0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
        waresTickets: [
          {
            wareId: 5,
            ticketId: 1,
            amount: 2,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
      },
      {
        id: 4,
        name: "Versace Men's 4-Pc. Eros Eau de Toilette Gift Set",
        type: "perfume",
        tags: ["men", "4-pc"],
        unitPrice: 176,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        stock: 5,
        ordersWares: [
          {
            id: 4,
            wareId: 4,
            orderId: 2,
            unitPrice: 150,
            amount: 5,
            returned: 0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
        waresTickets: [],
      },
      {
        id: 3,
        name: "The Leather Medium Tote Bag",
        type: "bag",
        tags: ["women"],
        unitPrice: 450,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        stock: 1,
        ordersWares: [
          {
            id: 3,
            wareId: 3,
            orderId: 1,
            unitPrice: 415,
            amount: 2,
            returned: 0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
        waresTickets: [
          {
            wareId: 3,
            ticketId: 2,
            amount: 1,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
      },
      {
        id: 2,
        name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
        type: "perfume",
        tags: ["women", "3-pc"],
        unitPrice: 178,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        stock: 4,
        ordersWares: [
          {
            id: 2,
            wareId: 2,
            orderId: 1,
            unitPrice: 160,
            amount: 5,
            returned: 0,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
        waresTickets: [
          {
            wareId: 2,
            ticketId: 1,
            amount: 1,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
      },
      {
        id: 1,
        name: "Loewe 001 Woman Perfume",
        type: "perfume",
        tags: ["women", "1-pc"],
        unitPrice: 155,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        stock: 0,
        ordersWares: [
          {
            id: 1,
            wareId: 1,
            orderId: 1,
            unitPrice: 145,
            amount: 10,
            returned: 10,
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-01T00:00:00.000Z",
          },
        ],
        waresTickets: [
          {
            wareId: 1,
            ticketId: 3,
            amount: 1,
            returned: 1,
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
          },
          {
            wareId: 1,
            ticketId: 1,
            amount: 1,
            returned: 1,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
      },
    ]

    async function getWaresIt(
      requestBody,
      expectedWares = [],
      isPrinted = false
    ) {
      expectedWares = Array.isArray(expectedWares)
        ? expectedWares
        : [expectedWares]

      const { status, data: wares } = await client.post(
        "/wares/search",
        requestBody
      )

      if (isPrinted) {
        for (const ware of wares) {
          console.log(ware, ",")
        }
      }

      expect(status).to.equal(OK)
      expect(wares).to.be.jsonSchema(waresSchema)
      expect(wares).to.eql(expectedWares)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getWaresIt({}, allWares)
    })

    it("When name is the only input, Then response all providers with the name that includes the subtring entered", async function () {
      await getWaresIt({ name: "versace" }, allWares[1])
    })

    it("When type is the only input, Then response all providers with the type that includes the subtring entered", async function () {
      await getWaresIt({ type: "perfume" }, [
        allWares[1],
        allWares[3],
        allWares[4],
      ])
    })

    it("When tags array is the only input, Then response all providers that match all the corresponding tags", async function () {
      await getWaresIt({ tags: ["women", "1-pc"] }, allWares[4])
    })

    it("When stock is the only input, Then response all orders with the same stock", async function () {
      await getWaresIt({ stock: 4 }, allWares[3])
    })

    it("When unitPrice is the only input, Then response all orders with the same unitPrice", async function () {
      await getWaresIt({ unitPrice: 155 }, allWares[4])
    })

    it("When a created at date is given, Then response is all wares within that same month and year", async function () {
      await getWaresIt({ createdAt: new Date("2025-01-09") }, allWares)
    })

    it("When a updated at date is given, Then response is all wares within that same month and year", async function () {
      await getWaresIt({ updatedAt: new Date("2024-12-10") })
    })

    it("When multiple inputs are given, Then response is all wares that satisfy the input comparisons", async function () {
      await getWaresIt(
        {
          id: 5,
          name: "Eymi",
          type: "brac",
          tags: ["unisex"],
          stock: 8,
          unitPrice: 14,
          createdAt: "2025-01-09",
          updatedAt: "2025-01-09",
        },
        allWares[0]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then ware is created ", async function () {
      const tags = ["unisex"]
      const requestBody = {
        name: "Baccarat Rouge 540 Maison Francis Kurkdjian Extrait De Parfum",
        type: "perfume",
        tags,
        unitPrice: round(Math.random() * 30) + 90,
      }

      const { status, data } = await client.post("/wares", requestBody)

      const newWareSearched = await models.Wares.findOne({
        where: requestBody,
      })
      const newWare = newWareSearched.dataValues
      const newWareDeleted = await models.Wares.destroy({
        where: requestBody,
      })
      delete requestBody.tags

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" ware has been created.")
      expect(newWare).to.include(requestBody)
      expect(newWare.tags).to.eql(tags)
      expect(newWareDeleted).to.equal(1)
    })
  })

  describe("Put /:wareId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const wareId = Math.ceil(Math.random() * 3)
      const requestBody = {}

      const { status, data } = await client.put("/wares/" + wareId, requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ware has the respective information updated", async function () {
      let tags = ["men"]
      const wareBeforeCreated = await models.Wares.create({
        name: "Men's 4.0mm Solid Foxtail Chain Bracelet in Stainless Steel - 9.0\"",
        type: "bracelet",
        tags,
        unitPrice: round(Math.random() * 4) + 48,
      })
      const wareBefore = wareBeforeCreated.dataValues
      const wareId = wareBefore.id
      tags = ["unisex"]
      const requestBody = {
        name: "Men's 4.0mm Solid Foxtail Chain Bracelet in Silver - 9.0\"",
        tags,
        unitPrice: round(Math.random() * 4) + 68,
      }

      const { status, data } = await client.put("/wares/" + wareId, requestBody)

      const wareAfterSearched = await models.Wares.findOne({
        where: { id: wareId },
      })
      const wareAfter = wareAfterSearched.dataValues
      const wareDeleted = await models.Wares.destroy({
        where: { id: wareId },
      })
      delete requestBody.tags

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` ware with id = ${wareId} was updated`)
      expect(wareAfter).to.include(requestBody)
      expect(wareAfter.tags).to.eql(tags)
      expect(new Date(wareBefore.updatedAt)).to.be.beforeTime(
        new Date(wareAfter.updatedAt)
      )
      expect(wareDeleted).to.equal(1)
    })
  })

  describe("Delete /:wareId", function () {
    it("When taget ware id exists, Then respective ware is deleted ", async function () {
      const wareCreated = await models.Wares.create({
        name: "Bombshell Mini Fragrance Duo",
        type: "bracelet",
        tags: ["women", "2-pc"],
        unitPrice: round(Math.random() * 4) + 48,
      })
      const newWare = wareCreated.dataValues
      const wareId = newWare.id

      const { status, data } = await client.delete("/wares/" + wareId)

      const afterWareSearched = await models.Wares.findOne({
        where: { id: wareId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ware with id = ${wareId} and fullname = ${newWare.fullname}.`
        )
      expect(afterWareSearched).to.equal(null)
    })
  })
})
