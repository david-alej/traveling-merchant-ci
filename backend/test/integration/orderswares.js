const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  faker,
  round,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("OrdersWares Routes", function () {
  let client
  const orderswareObject = {
    type: "object",
    required: [
      "orderId",
      "wareId",
      "amount",
      "unitPrice",
      "returned",
      "createdAt",
      "updatedAt",
      "order",
      "ware",
    ],
    properties: {
      order: {
        type: "object",
        required: [
          "id",
          "providerId",
          "cost",
          "tax",
          "shipment",
          "expectedAt",
          "actualAt",
          "createdAt",
          "updatedAt",
        ],
      },
      wareBought: {
        type: "object",
        required: [
          "id",
          "name",
          "type",
          "tags",
          "unitPrice",
          "createdAt",
          "updatedAt",
        ],
      },
    },
  }

  const orderswareSchema = {
    title: "OrdersWare schema",
    ...orderswareObject,
  }

  const orderswaresSchema = {
    title: "OrdersWares Schema",
    type: "array",
    items: {
      ...orderswareObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:orderswareId", function () {
    it("When an existing order id and ware id is given, Then the response is the ordersware", async function () {
      const orderId = 1
      const wareId = [1, 3][Math.floor(Math.random() * 2)]

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(orderswareSchema)
    })

    it("When an non-existing id for order id is given, Then the response is not found #paramOrdersWareId", async function () {
      const orderId = Math.ceil(Math.random() * 3) + 2
      const wareId = Math.ceil(Math.random() * 4)

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Order not found.")
    })

    it("When an non-existing id for ware id is given, Then the response is not found #paramOrdersWareId", async function () {
      const orderId = Math.ceil(Math.random() * 2)
      const wareId = Math.ceil(Math.random() * 4) + 10

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("OrdersWare not found.")
    })

    it("When order id or ware id given is not an integer, Then the response is not found #integerValidator #paramOrdersWareId", async function () {
      const orderId = "hi"
      const wareId = Math.ceil(Math.random() * 4)

      const { status, data } = await client.get(
        `/orderswares/${orderId}/${wareId}`
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allOrdersWares = [
      {
        id: 5,
        wareId: 5,
        orderId: 2,
        unitPrice: 10,
        amount: 10,
        returned: 0,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        order: {
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
        ware: {
          id: 5,
          name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
          type: "braclet",
          tags: ["unisex"],
          unitPrice: 14,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 4,
        wareId: 4,
        orderId: 2,
        unitPrice: 150,
        amount: 5,
        returned: 0,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        order: {
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
        ware: {
          id: 4,
          name: "Versace Men's 4-Pc. Eros Eau de Toilette Gift Set",
          type: "perfume",
          tags: ["men", "4-pc"],
          unitPrice: 176,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 3,
        wareId: 3,
        orderId: 1,
        unitPrice: 415,
        amount: 2,
        returned: 0,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        order: {
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
        ware: {
          id: 3,
          name: "The Leather Medium Tote Bag",
          type: "bag",
          tags: ["women"],
          unitPrice: 450,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 2,
        wareId: 2,
        orderId: 1,
        unitPrice: 160,
        amount: 5,
        returned: 0,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        order: {
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
        ware: {
          id: 2,
          name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
          type: "perfume",
          tags: ["women", "3-pc"],
          unitPrice: 178,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
      {
        id: 1,
        wareId: 1,
        orderId: 1,
        unitPrice: 145,
        amount: 10,
        returned: 10,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
        order: {
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
        ware: {
          id: 1,
          name: "Loewe 001 Woman Perfume",
          type: "perfume",
          tags: ["women", "1-pc"],
          unitPrice: 155,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
    ]

    async function getOrdersWaresIt(
      requestBody,
      expectedOrdersWares = [],
      isPrinted = false
    ) {
      expectedOrdersWares = Array.isArray(expectedOrdersWares)
        ? expectedOrdersWares
        : [expectedOrdersWares]

      const { status, data: orderswares } = await client.post(
        "/orderswares/search",
        requestBody
      )
      if (isPrinted) console.log(orderswares)
      expect(status).to.equal(OK)
      expect(orderswares).to.be.jsonSchema(orderswaresSchema)
      expect(orderswares).to.eql(expectedOrdersWares)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getOrdersWaresIt({}, allOrdersWares)
    })

    it("When order id is the only input, Then response all orders with the same provider id", async function () {
      await getOrdersWaresIt({ orderId: 1 }, allOrdersWares.slice(2))
    })

    it("When ware id is the only input, Then response all orders with the same ware id", async function () {
      await getOrdersWaresIt({ wareId: 3 }, allOrdersWares[2])
    })

    it("When unitPrice is the only input, Then response all orders with the same unitPrice", async function () {
      await getOrdersWaresIt({ unitPrice: 10 }, allOrdersWares[0])
    })

    it("When returned is the only input, Then response all orders with the same returned", async function () {
      await getOrdersWaresIt({ returned: 10 }, allOrdersWares[4])
    })

    it("When a createdAt date is given, Then response is all orderswares within that same month and year", async function () {
      await getOrdersWaresIt(
        { createdAt: { year: 2025, month: 0 } },
        allOrdersWares
      )
    })

    it("When a updatedAt date string is given, Then response is all orderswares with the exact same date down to the hour", async function () {
      await getOrdersWaresIt({ updatedAt: new Date("2024-12-10") })
    })

    it("When multiple inputs are given, Then response is all orderswares that satisfy the input comparisons", async function () {
      await getOrdersWaresIt(
        {
          orderId: 1,
          wareId: 1,
          unitPrice: 145,
          amount: 10,
          returned: 10,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
        allOrdersWares[4]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then ordersware is created ", async function () {
      const orderId = Math.ceil(Math.random() * 2)
      const requestBody = {
        orderId,
        wareId: orderId === 1 ? [4, 5][Math.floor(Math.random() * 2)] : 2,
        unitPrice: round(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      }

      const { status, data } = await client.post("/orderswares", requestBody)

      const newOrdersWareSearched = await models.OrdersWares.findOne({
        where: requestBody,
      })
      const newOrdersWare = newOrdersWareSearched.dataValues
      const newOrdersWareDeleted = await models.OrdersWares.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" ordersware has been created.")
      expect(newOrdersWare).to.include(requestBody)
      expect(newOrdersWareDeleted).to.equal(1)
    })
  })

  describe("Put /:orderId/:wareId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const orderId = 1
      const wareId = [1, 3][Math.floor(Math.random() * 2)]
      const requestBody = {}

      const { status, data } = await client.put(
        `/orderswares/${orderId}/${wareId}`,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ordersware has the respective information updated", async function () {
      const newOrderCreated = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        tax: round(Math.random() * 40 + 60),
        shipment: round(Math.random() * 10 + 5),
        expectedAt: faker.date.future().toISOString(),
      })
      const newOrder = JSON.parse(JSON.stringify(newOrderCreated))
      const orderId = newOrder.id
      const wareId = Math.ceil(Math.random() * 2) + 3
      const newOrdersWare = {
        orderId,
        wareId,
        cost: round(Math.random() * 7) + 150,
        amount: Math.ceil(Math.random() * 3),
        unitPrice: round(Math.random() * 40 + 50),
      }
      const orderswareBeforeCreated = await models.OrdersWares.create(
        newOrdersWare
      )
      const orderswareBefore = orderswareBeforeCreated.dataValues
      const requestBody = {
        unitPrice: round(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3) + 1,
        returned: 1,
      }

      const { status, data } = await client.put(
        `/orderswares/${orderswareBefore.orderId}/${orderswareBefore.wareId}`,
        requestBody
      )

      const orderAfterSearched = await models.Orders.findOne({
        where: {
          id: orderId,
        },
        include: { model: models.OrdersWares, as: "ordersWares" },
      })
      const orderAfter = JSON.parse(JSON.stringify(orderAfterSearched))
      const orderswareAfter = orderAfter.ordersWares[0]
      delete orderAfter.ordersWares
      const ordersDeleted = await models.Orders.destroy({
        where: {
          id: orderId,
        },
      })
      const orderswareDeleted = await models.OrdersWares.destroy({
        where: {
          orderId,
          wareId,
        },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` ordersware with order id of ${orderId} and ware id of ${wareId} was updated`
        )
      expect(newOrder).to.include(orderAfter)
      expect(orderswareAfter).to.include(requestBody)
      expect(new Date(orderswareBefore.updatedAt)).to.be.beforeTime(
        new Date(orderswareAfter.updatedAt)
      )
      expect(ordersDeleted).to.equal(1)
      expect(orderswareDeleted).to.equal(0)
    })
  })

  describe("Delete /:orderId/:wareId", function () {
    it("When taget ordersware id exists, Then respective ordersware is deleted ", async function () {
      const newOrder = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        expectedAt: faker.date.future().toISOString(),
        actualAt: null,
      })
      const orderId = newOrder.dataValues.id
      const wareId = Math.ceil(Math.random() * 4)
      await models.OrdersWares.create({
        orderId,
        wareId,
        unitPrice: round(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })

      const { status, data } = await client.delete(
        `/orderswares/${orderId}/${wareId}`
      )

      const afterOrdersWareSearched = await models.OrdersWares.findOne({
        where: { orderId, wareId },
      })
      const orderDeleted = await models.Orders.destroy({
        where: { id: orderId },
      })
      const ordersWaresDeleted = await models.OrdersWares.destroy({
        where: { orderId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ordersware with order id of ${orderId} and ware id of ${wareId}.`
        )
      expect(afterOrdersWareSearched).to.equal(null)
      expect(orderDeleted).to.equal(1)
      expect(ordersWaresDeleted).to.equal(0)
    })
  })

  describe("Delete /:orderId", function () {
    it("When order id is not an integer, Then response is bad request ", async function () {
      const orderId = "string"
      const { status, data } = await client.delete("/orderswares/" + orderId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When order id does not exists, Then response is not found ", async function () {
      const orderId = 10 + Math.ceil(Math.random() * 5)

      const { status, data } = await client.delete("/orderswares/" + orderId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Order not found.")
    })

    it("When order id exists, Then all orderswares rows with respective order id are deleted ", async function () {
      const newOrder = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        expectedAt: faker.date.future().toISOString(),
        actualAt: null,
      })
      const orderId = newOrder.dataValues.id
      await models.OrdersWares.create({
        orderId,
        wareId: Math.ceil(Math.random() * 2),
        unitPrice: round(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })
      await models.OrdersWares.create({
        orderId,
        wareId: Math.ceil(Math.random() * 2) + 2,
        unitPrice: round(Math.random() * 750) + 250,
        amount: Math.ceil(Math.random() * 3),
      })

      const { status, data } = await client.delete("/orderswares/" + orderId)

      const afterOrdersWareSearched = await models.OrdersWares.findAll({
        where: { orderId },
      })
      const orderDeleted = await models.Orders.destroy({
        where: { id: orderId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` has deleted all orderswares with order id = ${orderId}.`)
      expect(afterOrdersWareSearched).to.eql([])
      expect(orderDeleted).to.equal(1)
    })
  })
})
