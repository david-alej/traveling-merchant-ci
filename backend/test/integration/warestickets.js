const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("WaresTickets Routes", function () {
  let client
  const waresticketObject = {
    type: "object",
    required: [
      "wareId",
      "ticketId",
      "amount",
      "returned",
      "createdAt",
      "updatedAt",
      "ticket",
      "ware",
    ],
    properties: {
      ticket: {
        type: "object",
        required: [
          "id",
          "clientId",
          "cost",
          "paymentPlan",
          "description",
          "createdAt",
          "updatedAt",
          "returned",
          "paid",
          "owed",
        ],
      },
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
  }

  const waresticketSchema = {
    title: "WaresTicket schema",
    ...waresticketObject,
  }

  const waresticketsSchema = {
    title: "WaresTickets Schema",
    type: "array",
    items: {
      ...waresticketObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:ticketId/:wareId", function () {
    it("When an existing waresticket id is given, Then the response is the waresticket", async function () {
      const [ticketId, wareId] = [
        [1, [1, 2, 5][Math.floor(Math.random() * 3)]],
        [2, 3],
        [3, 1],
      ][Math.floor(Math.random() * 3)]

      const { status, data } = await client.get(
        `/warestickets/${ticketId}/${wareId}`
      )

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(waresticketSchema)
    })

    it("When an non-existing ticket id is given, Then the response is not found #paramWaresTicketId", async function () {
      const wareId = Math.ceil(Math.random() * 10) + 3
      const ticketId = Math.floor(Math.random() * 3) + 3

      const { status, data } = await client.get(
        `/warestickets/${wareId}/${ticketId}`
      )

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ticket not found.")
    })

    it("When waresticket id given is not an integer, Then the response is not found #integerValidator #paramWaresTicketId", async function () {
      const wareId = "string"
      const ticketId = 2

      const { status, data } = await client.get(
        `/warestickets/${wareId}/${ticketId}`
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allWaresTickets = [
      {
        wareId: 1,
        ticketId: 3,
        amount: 1,
        returned: 1,
        createdAt: "2025-01-13T00:00:00.000Z",
        updatedAt: "2025-01-13T00:00:00.000Z",
        ticket: {
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
      {
        wareId: 3,
        ticketId: 2,
        amount: 1,
        returned: 0,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
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
        wareId: 5,
        ticketId: 1,
        amount: 2,
        returned: 0,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
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
        wareId: 2,
        ticketId: 1,
        amount: 1,
        returned: 0,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
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
        wareId: 1,
        ticketId: 1,
        amount: 1,
        returned: 1,
        createdAt: "2025-01-09T00:00:00.000Z",
        updatedAt: "2025-01-09T00:00:00.000Z",
        ticket: {
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
    ]

    async function getWaresTicketsIt(
      requestBody,
      expectedWaresTickets = [],
      isPrinted = false
    ) {
      expectedWaresTickets = Array.isArray(expectedWaresTickets)
        ? expectedWaresTickets
        : [expectedWaresTickets]

      const { status, data: warestickets } = await client.post(
        "/warestickets/search",
        requestBody
      )

      if (isPrinted) {
        console.log("[")

        for (const waresticket of warestickets) console.log(waresticket, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(warestickets).to.be.jsonSchema(waresticketsSchema)
      expect(warestickets).to.eql(expectedWaresTickets)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getWaresTicketsIt({}, allWaresTickets)
    })

    it("When ware id is the only input, Then response is all orders with the same ware id", async function () {
      await getWaresTicketsIt({ wareId: 1 }, [
        allWaresTickets[0],
        allWaresTickets[4],
      ])
    })

    it("When ticket id is the only input, Then response is all orders with the same ticket id", async function () {
      await getWaresTicketsIt({ ticketId: 1 }, allWaresTickets.slice(2))
    })

    it("When amount is the only input, Then response is all orders with the same amount of a ware sold on the ticket", async function () {
      await getWaresTicketsIt({ amount: 5 })
    })

    it("When returned is the only input, Then response is all orders with the same number of returned wares that are the same type of ware on the ticket", async function () {
      await getWaresTicketsIt({ returned: 0 }, allWaresTickets)
    })

    it("When a created at date is given, Then response is all warestickets within that same month and year", async function () {
      await getWaresTicketsIt(
        { createdAt: { year: 2025, month: 0 } },
        allWaresTickets
      )
    })

    it("When a updated at date is given, Then response is all warestickets within that same month and year", async function () {
      await getWaresTicketsIt({ updatedAt: { year: 2024, month: 11 } })
    })

    it("When multiple inputs are given, Then response is all warestickets that satisfy the input comparisons", async function () {
      await getWaresTicketsIt(
        {
          ticketId: 1,
          wareId: 2,
          amount: 1,
          returned: 0,
          createdAt: { year: 2025, month: 0, day: 8 },
          updatedAt: { year: 2025, month: 0, day: 8 },
        },
        allWaresTickets[3]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs required values, Then waresticket is created ", async function () {
      const [ticketId, wareId] = [
        [1, [3, 4][Math.floor(Math.random() * 2)]],
        [2, [1, 2, 4, 5][Math.floor(Math.random() * 4)]],
        [3, [2, 3, 4, 5][Math.floor(Math.random() * 4)]],
      ][Math.floor(Math.random() * 3)]
      const requestBody = {
        wareId,
        ticketId,
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      }

      const { status, data } = await client.post("/warestickets", requestBody)

      const newWaresTicketSearched = await models.WaresTickets.findOne({
        where: requestBody,
      })
      const newWaresTicket = newWaresTicketSearched.dataValues
      const newWaresTicketDeleted = await models.WaresTickets.destroy({
        where: requestBody,
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" waresticket has been created.")
      expect(newWaresTicket).to.include(requestBody)
      expect(newWaresTicketDeleted).to.equal(1)
    })
  })

  describe("Put /:ticketId/:wareId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const [ticketId, wareId] = [
        [1, [1, 2, 5][Math.floor(Math.random() * 3)]],
        [2, 3],
        [3, 1],
      ][Math.floor(Math.random() * 3)]
      const requestBody = {}

      const { status, data } = await client.put(
        `/warestickets/${ticketId}/${wareId}`,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then waresticket has the respective information updated", async function () {
      const [ticketId, wareId] = [
        [1, [3, 4][Math.floor(Math.random() * 2)]],
        [2, [1, 2, 4, 5][Math.floor(Math.random() * 4)]],
        [3, [2, 3, 4, 5][Math.floor(Math.random() * 4)]],
      ][Math.floor(Math.random() * 3)]
      const waresticketBeforeCreated = await models.WaresTickets.create({
        wareId,
        ticketId,
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      })
      const waresticketBefore = waresticketBeforeCreated.dataValues
      const requestBody = {
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      }

      const { status, data } = await client.put(
        `/warestickets/${ticketId}/${wareId}`,
        requestBody
      )

      const waresticketAfterSearched = await models.WaresTickets.findOne({
        where: { wareId, ticketId },
      })
      const waresticketAfter = waresticketAfterSearched.dataValues
      const waresticketDeleted = await models.WaresTickets.destroy({
        where: { wareId, ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` waresticket with ticket id = ${ticketId} and ware id = ${wareId} was updated`
        )
      expect(waresticketAfter).to.include(requestBody)
      expect(new Date(waresticketBefore.updatedAt)).to.be.beforeTime(
        new Date(waresticketAfter.updatedAt)
      )
      expect(waresticketDeleted).to.equal(1)
    })
  })

  describe("Delete /:ticketId/:wareId", function () {
    it("When taget waresticket id exists, Then respective waresticket is deleted ", async function () {
      const [ticketId, wareId] = [
        [1, [3, 4][Math.floor(Math.random() * 2)]],
        [2, [1, 2, 4, 5][Math.floor(Math.random() * 4)]],
        [3, [2, 3, 4, 5][Math.floor(Math.random() * 4)]],
      ][Math.floor(Math.random() * 3)]
      await models.WaresTickets.create({
        wareId,
        ticketId,
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      })

      const { status, data } = await client.delete(
        `/warestickets/${ticketId}/${wareId}`
      )

      const afterWaresTicketSearched = await models.WaresTickets.findOne({
        where: { wareId, ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a waresticket with ticket id = ${ticketId} and ware id = ${wareId}.`
        )
      expect(afterWaresTicketSearched).to.equal(null)
    })
  })

  describe("Delete /:ticketId", function () {
    it("When taget ticket id is not an integer, Then response is bad request ", async function () {
      const ticketId = "string"

      const { status, data } = await client.delete(`/warestickets/${ticketId}`)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When taget ticket id does not exists, Then response is not found ", async function () {
      const ticketId = Math.ceil(Math.random() * 5) + 5

      const { status, data } = await client.delete(`/warestickets/${ticketId}`)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ticket not found.")
    })

    it("When taget ticket id exists, Then respective warestickets are deleted ", async function () {
      const newTicketCreated = await models.Tickets.create({
        clientId: 3,
        cost: Math.ceil(Math.random() * 250) + 500,
        paymentPlan: "biweekly",
        soldAt: new Date("2025-01-23"),
      })
      const newTicket = newTicketCreated.dataValues
      const ticketId = newTicket.id
      await models.WaresTickets.create({
        wareId: Math.ceil(Math.random() * 2),
        ticketId,
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      })
      await models.WaresTickets.create({
        wareId: Math.ceil(Math.random() * 2) + 2,
        ticketId,
        amount: Math.ceil(Math.random() * 3),
        returned: Math.ceil(Math.random() * 2),
      })

      const { status, data } = await client.delete(`/warestickets/${ticketId}`)

      const afterWaresTicketSearched = await models.WaresTickets.findOne({
        where: { ticketId },
      })
      const ticketDeleted = await models.Tickets.destroy({
        where: { id: ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` has deleted a waresticket with ticket id = ${ticketId}.`)
      expect(afterWaresTicketSearched).to.equal(null)
      expect(ticketDeleted).to.equal(1)
    })
  })
})
