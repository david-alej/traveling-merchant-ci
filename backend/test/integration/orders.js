const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  round,
  fakerPhoneNumber,
  faker,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

const allOrders = [
  {
    id: 2,
    providerId: 2,
    cost: 959.59,
    tax: 89.59,
    shipment: 20,
    owed: 0,
    returned: 0,
    paid: 959.59,
    expectedAt: "2025-01-09T00:00:00.000Z",
    actualAt: "2025-01-09T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-17T00:00:00.000Z",
    provider: {
      id: 2,
      name: "Ebay",
      address: "0000 online",
      phoneNumber: "5125869601",
      email: "",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
    transactions: [
      {
        id: 2,
        ticketId: null,
        orderId: 2,
        payment: 959.59,
        paymentType: "visa",
        paidAt: "2025-01-01T20:00:00.000Z",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
    ],
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
        ware: {
          id: 5,
          name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
          type: "braclet",
          tags: ["unisex"],
          unitPrice: 14,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          stock: 8,
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
        ware: {
          id: 4,
          name: "Versace Men's 4-Pc. Eros Eau de Toilette Gift Set",
          type: "perfume",
          tags: ["men", "4-pc"],
          unitPrice: 176,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          stock: 5,
        },
      },
    ],
  },
  {
    id: 1,
    providerId: 1,
    cost: 3413.65,
    tax: 283.65,
    shipment: 50,
    paid: 1963.65,
    owed: 0,
    returned: 1450,
    actualAt: "2025-01-09T00:00:00.000Z",
    expectedAt: "2025-01-08T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    provider: {
      id: 1,
      name: "Amazon",
      address: "0000 online",
      phoneNumber: "1632474734",
      email: "derick_kertzmann@amazon.support.com",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
    transactions: [
      {
        createdAt: "2025-01-17T00:00:00.000Z",
        id: 8,
        orderId: 1,
        paidAt: "2025-01-17T00:00:00.000Z",
        payment: -1450,
        paymentType: "visa",
        ticketId: null,
        updatedAt: "2025-01-17T00:00:00.000Z",
      },
      {
        createdAt: "2025-01-01T00:00:00.000Z",
        id: 1,
        orderId: 1,
        paidAt: "2025-01-01T20:00:00.000Z",
        payment: 3413.65,
        paymentType: "visa",
        ticketId: null,
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
    ],
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
        ware: {
          id: 3,
          name: "The Leather Medium Tote Bag",
          type: "bag",
          tags: ["women"],
          unitPrice: 450,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          stock: 1,
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
        ware: {
          id: 2,
          name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
          type: "perfume",
          tags: ["women", "3-pc"],
          unitPrice: 178,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          stock: 4,
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
        ware: {
          id: 1,
          name: "Loewe 001 Woman Perfume",
          type: "perfume",
          tags: ["women", "1-pc"],
          unitPrice: 155,
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          stock: 0,
        },
      },
    ],
  },
]

describe("Orders Routes", function () {
  let client
  const orderObject = {
    type: "object",
    required: [
      "id",
      "providerId",
      "cost",
      "expectedAt",
      "actualAt",
      "createdAt",
      "updatedAt",
      "provider",
      "ordersWares",
    ],
    properties: {
      provider: {
        type: "object",
        required: [
          "id",
          "name",
          "address",
          "phoneNumber",
          "createdAt",
          "updatedAt",
        ],
      },
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
            "ware",
          ],
          properties: {
            ware: {
              type: "object",
              required: [
                "id",
                "name",
                "type",
                "tags",
                "unitPrice",
                "createdAt",
                "updatedAt",
                "stock",
              ],
            },
          },
        },
      },
    },
  }

  const orderSchema = {
    title: "Order schema",
    ...orderObject,
  }

  const ordersSchema = {
    title: "Orders Schema",
    type: "array",
    items: {
      ...orderObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:orderId", function () {
    it("When an existing order id is given, Then the response is the order", async function () {
      const orderId = Math.ceil(Math.random() * 2)

      const { status, data } = await client.get("/orders/" + orderId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(orderSchema)
    })

    it("When an non-existing order id is given, Then the response is not found #paramOrderId", async function () {
      const orderId = Math.ceil(Math.random() * 10) + 2

      const { status, data } = await client.get("/orders/" + orderId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Order not found.")
    })

    it("When order id given is not an integer, Then the response is not found #integerValidator #paramOrderId", async function () {
      const orderId = "string"

      const { status, data } = await client.get("/orders/" + orderId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    async function getOrdersIt(
      requestBody,
      expectedOrders = [],
      isPrinted = false
    ) {
      expectedOrders = Array.isArray(expectedOrders)
        ? expectedOrders
        : [expectedOrders]

      const { status, data: orders } = await client.post(
        "/orders/search",
        requestBody
      )

      if (isPrinted) {
        for (const order of orders) {
          console.log(order.ordersWares, ",")
        }
      }

      expect(status).to.equal(OK)
      expect(orders).to.be.jsonSchema(ordersSchema)
      expect(orders).to.eql(expectedOrders)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getOrdersIt({}, allOrders)
    })

    it("When provider id is the only input, Then response all orders with the same provider id", async function () {
      await getOrdersIt({ providerId: 1 }, allOrders[1])
    })

    it("When cost is the only input, Then response all orders with the same cost", async function () {
      await getOrdersIt({ cost: 3413.65 }, allOrders[1])
    })

    it("When tax is the only input, Then response all orders with the same tax", async function () {
      await getOrdersIt({ tax: 89.59 }, allOrders[0])
    })

    it("When shipment is the only input, Then response all orders with the same shipment", async function () {
      await getOrdersIt({ shipment: 20 }, allOrders[0])
    })

    it("When an expectedAt date object is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ expectedAt: { year: 2025, month: 0 } }, allOrders)
    })

    it("When an actualAt date string is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ actualAt: { year: 2025, month: 0 } }, allOrders)
    })

    it("When a createdAt date string is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ createdAt: new Date("2025-02-11") })
    })

    it("When a updatedAt date object is given, Then response is all orders within that same month and year", async function () {
      await getOrdersIt({ updatedAt: { year: 2025, month: 0 } }, allOrders)
    })

    it("When multiple inputs are given, Then response is all orders that satisfy the input comparisons", async function () {
      await getOrdersIt(
        {
          providerId: 2,
          cost: 959.59,
          tax: 89.59,
          shipment: 20,
          expectedAt: { year: 2025, month: 0 },
          actualAt: { year: 2025, month: 0 },
          createdAt: { year: 2025, month: 0 },
          updatedAt: { year: 2025, month: 0 },
        },
        allOrders[0]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs values for orders data but not required ordersWares input, Then response is bad request ", async function () {
      const tax = Math.random() * 100 + 400
      const shipment = Math.random() * 10 + 60
      let cost = Math.random() * 200 + 400
      const requestBody = {
        providerId: Math.ceil(Math.random() * 4),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-02",
      }

      const { status, data } = await client.post("/orders", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for orders data and ordersWares data with duplicate ware ids, Then response is bad request ", async function () {
      const unitPrice1 = 155
      const unitPrice5 = 14
      const ordersWares = [
        { wareId: 1, unitPrice: unitPrice1, amount: 1 },
        { wareId: 5, unitPrice: unitPrice5, amount: 1 },
        { wareId: 1, unitPrice: unitPrice1, amount: 1 },
      ]
      const tax = Math.random() * 100 + 400
      const shipment = Math.random() * 10 + 60
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const requestBody = {
        providerId: Math.ceil(Math.random() * 2),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-0" + Math.ceil(Math.random() * 10),
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for orders data and ordersWares data that contains a non-exisiting wareId, Then response is bad request ", async function () {
      const unitPrice1 = 155
      const unitPrice5 = 14
      const unitPrice700 = 700
      const ordersWares = [
        { wareId: 1, unitPrice: unitPrice1, amount: 1 },
        { wareId: 5, unitPrice: unitPrice5, amount: 1 },
        { wareId: 700, unitPrice: unitPrice700, amount: 1 },
      ]
      const tax = Math.random() * 100 + 400
      const shipment = Math.random() * 10 + 60
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const requestBody = {
        providerId: Math.ceil(Math.random() * 2),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-0" + Math.ceil(Math.random() * 10),
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ware not found.")
    })

    it("When merchant inputs values for orders data and ordersWares data that contains the more amount returned than was bought, Then response is bad request ", async function () {
      const unitPrice1 = 155
      const unitPrice5 = 14
      const ordersWares = [
        { wareId: 1, unitPrice: unitPrice1, amount: 1, returned: 2 },
        { wareId: 5, unitPrice: unitPrice5, amount: 1 },
      ]
      const tax = Math.random() * 100 + 400
      const shipment = Math.random() * 10 + 60
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const requestBody = {
        providerId: Math.ceil(Math.random() * 2),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-0" + Math.ceil(Math.random() * 10),
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs required values, Then order is created ", async function () {
      const unitPrice4 = 176
      const unitPrice5 = 14
      const ordersWares = [
        { wareId: 4, unitPrice: unitPrice4, amount: 1 },
        { wareId: 5, unitPrice: unitPrice5, amount: 3, returned: 1 },
      ]
      const tax = Math.random() * 100 + 400
      const shipment = Math.random() * 10 + 60
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const requestBody = {
        providerId: Math.ceil(Math.random() * 4),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-02",
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      delete requestBody.ordersWares
      requestBody.expectedAt = new Date(requestBody.expectedAt).toISOString()
      const newOrderSearched = await models.Orders.findOne({
        where: requestBody,
        include: [{ model: models.OrdersWares, as: "ordersWares" }],
      })
      const newOrder = JSON.parse(JSON.stringify(newOrderSearched))
      const newOrdersWares = newOrder.ordersWares
      const newOrderDeleted = await models.Orders.destroy({
        where: requestBody,
      })
      const newOrdersWaresDeleted = await models.OrdersWares.destroy({
        where: { orderId: newOrder.id },
      })
      // newOrder.expectedAt = newOrder.expectedAt.toISOString()

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" order has been created.")
      expect(newOrder).to.include(requestBody)
      expect(newOrdersWares[0]).to.include(ordersWares[1])
      expect(newOrdersWares[1]).to.include(ordersWares[0])
      expect(newOrderDeleted).to.equal(1)
      expect(newOrdersWaresDeleted).to.equal(0)
    })

    it("When merchant inputs order required values and rovides the providerId and provider object at the same time, Then response is bad request ", async function () {
      const unitPrice4 = 176
      const unitPrice5 = 14
      const ordersWares = [
        { wareId: 4, unitPrice: unitPrice4, amount: 1 },
        { wareId: 5, unitPrice: unitPrice5, amount: 3, returned: 1 },
      ]
      const tax = round(Math.random() * 100 + 400)
      const shipment = round(Math.random() * 10 + 60)
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const provider = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        email: faker.internet.email(),
      }
      const requestBody = {
        provider,
        providerId: Math.ceil(Math.random() * 2),
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-02",
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs order required values and provider optional values, Then order is created ", async function () {
      const unitPrice4 = 176
      const unitPrice5 = 14
      const ordersWares = [
        { wareId: 4, unitPrice: unitPrice4, amount: 1 },
        { wareId: 5, unitPrice: unitPrice5, amount: 3, returned: 1 },
      ]
      const tax = round(Math.random() * 100 + 400)
      const shipment = round(Math.random() * 10 + 60)
      let cost = tax + shipment
      for (const ordersWare of ordersWares) {
        cost += ordersWare.unitPrice * ordersWare.amount
      }
      const provider = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phoneNumber: fakerPhoneNumber(),
        email: "victoria_adams@gmail.com",
      }
      const requestBody = {
        provider,
        cost,
        tax,
        shipment,
        expectedAt: "2025-02-02",
        ordersWares,
      }

      const { status, data } = await client.post("/orders", requestBody)

      delete requestBody.ordersWares
      delete requestBody.provider
      provider.phoneNumber = provider.phoneNumber.replace(/\D/g, "")
      requestBody.expectedAt = new Date(requestBody.expectedAt).toISOString()
      const newOrderSearched = await models.Orders.findOne({
        where: requestBody,
        include: [
          { model: models.OrdersWares, as: "ordersWares" },
          { model: models.Providers, as: "provider" },
        ],
      })
      const newOrder = JSON.parse(JSON.stringify(newOrderSearched))
      const newOrdersWares = newOrder.ordersWares
      const newProvider = newOrder.provider
      const newOrderDeleted = await models.Orders.destroy({
        where: requestBody,
      })
      const newOrdersWaresDeleted = await models.OrdersWares.destroy({
        where: { orderId: newOrder.id },
      })
      const newProviderDeleted = await models.Providers.destroy({
        where: { id: newOrder.providerId },
      })
      // newOrder.expectedAt = newOrder.expectedAt.toISOString()

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" order has been created.")
      expect(newOrder).to.include(requestBody)
      expect(newOrdersWares[0]).to.include(ordersWares[1])
      expect(newOrdersWares[1]).to.include(ordersWares[0])
      expect(newProvider).to.include(provider)
      expect(newOrderDeleted).to.equal(1)
      expect(newOrdersWaresDeleted).to.equal(0)
      expect(newProviderDeleted).to.equal(1)
    })
  })

  describe("Put /:orderId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const orderId = Math.ceil(Math.random() * 2)
      const requestBody = {}

      const { status, data } = await client.put(
        "/orders/" + orderId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then order has the respective information updated", async function () {
      const newOrder = {
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        tax: Math.random() * 40 + 40,
        shipment: Math.random() * 30 + 10,
        expectedAt: "2025-02-02",
        actualAt: null,
      }
      const orderBeforeCreated = await models.Orders.create(newOrder)
      const orderBefore = orderBeforeCreated.dataValues
      const orderId = orderBefore.id
      const requestBody = {
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        expectedAt: "2025-02-03",
        actualAt: "2025-02-04",
      }

      const { status, data } = await client.put(
        "/orders/" + orderId,
        requestBody
      )

      const orderAfterSearched = await models.Orders.findOne({
        where: { id: orderId },
      })
      const orderAfter = orderAfterSearched.dataValues
      const orderDeleted = await models.Orders.destroy({
        where: { id: orderId },
      })

      orderAfter.expectedAt = orderAfter.expectedAt.toISOString()
      orderAfter.actualAt = orderAfter.actualAt.toISOString()
      requestBody.expectedAt = new Date(requestBody.expectedAt).toISOString()
      requestBody.actualAt = new Date(requestBody.actualAt).toISOString()

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` order with id = ${orderId} was updated`)
      expect(orderAfter).to.include(requestBody)
      expect(new Date(orderBefore.updatedAt)).to.be.beforeTime(
        new Date(orderAfter.updatedAt)
      )
      expect(orderDeleted).to.equal(1)
    })
  })

  describe("Delete /:orderId", function () {
    it("When taget order id exists, Then respective order is deleted ", async function () {
      const orderCreated = await models.Orders.create({
        providerId: Math.ceil(Math.random() * 4),
        cost: round(Math.random() * 300) + 500,
        expectedAt: "2025-01-02",
        actualAt: null,
      })
      const newOrder = orderCreated.dataValues
      const orderId = newOrder.id

      const { status, data } = await client.delete("/orders/" + orderId)

      const afterOrderSearched = await models.Orders.findOne({
        where: { id: orderId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` has deleted a order with id = ${orderId}.`)
      expect(afterOrderSearched).to.equal(null)
    })
  })
})
