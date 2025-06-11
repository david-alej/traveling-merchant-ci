const {
  expect,
  httpStatusCodes,
  preMerchantMsg,
  models,
  round,
  faker,
  initializeClient,
} = require("../common")

const { OK, NOT_FOUND, BAD_REQUEST, CREATED } = httpStatusCodes

describe("Tickets Routes", function () {
  let client
  const ticketObject = {
    type: "object",
    required: [
      "id",
      "clientId",
      "cost",
      "paymentPlan",
      "description",
      "soldAt",
      "createdAt",
      "updatedAt",
      "returned",
      "paid",
      "owed",
      "client",
      "transactions",
      "waresTickets",
    ],
    properties: {
      client: {
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
        ],
        properties: {
          work: {
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
        },
      },
      transactions: {
        type: "array",
        items: {
          type: "object",
          required: [
            "id",
            "ticketId",
            "orderId",
            "payment",
            "paymentType",
            "paidAt",
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
            "ware",
          ],
        },
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
  }

  const ticketSchema = {
    title: "Ticket schema",
    ...ticketObject,
  }

  const ticketsSchema = {
    title: "Tickets Schema",
    type: "array",
    items: {
      ...ticketObject,
    },
  }

  before(async function () {
    const { axiosClient, status } = await initializeClient()

    expect(status).to.equal(OK)

    client = axiosClient
  })

  describe("Get /:ticketId", function () {
    it("When an existing ticket id is given, Then the response is the ticket", async function () {
      const ticketId = 1 //Math.ceil(Math.random() * 2)

      const { status, data } = await client.get("/tickets/" + ticketId)

      expect(status).to.equal(OK)
      expect(data).to.be.jsonSchema(ticketSchema)
    })

    it("When an non-existing ticket id is given, Then the response is not found #paramTicketId", async function () {
      const ticketId = Math.ceil(Math.random() * 10) + 3

      const { status, data } = await client.get("/tickets/" + ticketId)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ticket not found.")
    })

    it("When ticket id given is not an integer, Then the response is not found #integerValidator #paramTicketId", async function () {
      const ticketId = "string"

      const { status, data } = await client.get("/tickets/" + ticketId)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })
  })

  describe("Post /search", function () {
    const allTickets = [
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
        waresTickets: [
          {
            ticketId: 3,
            wareId: 1,
            amount: 1,
            returned: 1,
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
            ware: {
              id: 1,
              name: "Loewe 001 Woman Perfume",
              stock: 0,
              tags: ["women", "1-pc"],
              type: "perfume",
              unitPrice: 155,
              createdAt: "2025-01-09T00:00:00.000Z",
              updatedAt: "2025-01-09T00:00:00.000Z",
            },
          },
        ],
        transactions: [
          {
            id: 7,
            ticketId: 3,
            orderId: null,
            payment: -155,
            paymentType: "cash app",
            paidAt: "2025-01-17T00:00:00.000Z",
            createdAt: "2025-01-17T00:00:00.000Z",
            updatedAt: "2025-01-17T00:00:00.000Z",
          },
          {
            id: 5,
            ticketId: 3,
            orderId: null,
            payment: 168.27,
            paymentType: "cash",
            paidAt: "2025-01-13T00:00:00.000Z",
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
          },
        ],
        client: {
          id: 4,
          workId: 3,
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "2103424367",
          description: "",
          createdAt: "2025-01-13T00:00:00.000Z",
          updatedAt: "2025-01-13T00:00:00.000Z",
          work: {
            id: 3,
            name: "Lynch PLC",
            address: "38 Lafayette St.",
            phoneNumber: "9103623505",
            createdAt: "2025-01-13T00:00:00.000Z",
            updatedAt: "2025-01-13T00:00:00.000Z",
          },
        },
      },
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
        waresTickets: [
          {
            ticketId: 2,
            wareId: 3,
            amount: 1,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            ware: {
              id: 3,
              name: "The Leather Medium Tote Bag",
              stock: 1,
              tags: ["women"],
              type: "bag",
              unitPrice: 450,
              createdAt: "2025-01-09T00:00:00.000Z",
              updatedAt: "2025-01-09T00:00:00.000Z",
            },
          },
        ],
        transactions: [
          {
            id: 4,
            ticketId: 2,
            orderId: null,
            payment: 200,
            paymentType: "visa",
            paidAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
        client: {
          id: 3,
          workId: 2,
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "2543865553",
          description: "",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          work: {
            id: 2,
            name: "Deckow and Sons",
            address: "245 John Drive",
            phoneNumber: "7644084620",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        },
      },
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
        waresTickets: [
          {
            ticketId: 1,
            wareId: 5,
            amount: 2,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            ware: {
              id: 5,
              name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
              stock: 8,
              tags: ["unisex"],
              type: "braclet",
              unitPrice: 14,
              createdAt: "2025-01-09T00:00:00.000Z",
              updatedAt: "2025-01-09T00:00:00.000Z",
            },
          },
          {
            ticketId: 1,
            wareId: 2,
            amount: 1,
            returned: 0,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            ware: {
              id: 2,
              name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
              stock: 4,
              tags: ["women", "3-pc"],
              type: "perfume",
              unitPrice: 178,
              createdAt: "2025-01-09T00:00:00.000Z",
              updatedAt: "2025-01-09T00:00:00.000Z",
            },
          },
          {
            ticketId: 1,
            wareId: 1,
            amount: 1,
            returned: 1,
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            ware: {
              id: 1,
              name: "Loewe 001 Woman Perfume",
              stock: 0,
              tags: ["women", "1-pc"],
              type: "perfume",
              unitPrice: 155,
              createdAt: "2025-01-09T00:00:00.000Z",
              updatedAt: "2025-01-09T00:00:00.000Z",
            },
          },
        ],
        transactions: [
          {
            id: 6,
            ticketId: 1,
            orderId: null,
            payment: 86.9,
            paymentType: "visa",
            paidAt: "2025-01-16T00:00:00.000Z",
            createdAt: "2025-01-16T00:00:00.000Z",
            updatedAt: "2025-01-16T00:00:00.000Z",
          },
          {
            id: 3,
            ticketId: 1,
            orderId: null,
            payment: 150,
            paymentType: "cash app",
            paidAt: "2025-01-09T00:00:00.000Z",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        ],
        client: {
          id: 2,
          workId: 1,
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "9566347775",
          description: "",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
          work: {
            id: 1,
            name: "Hamill, Denesik and Davis",
            address: "38 Galvin Ave.",
            phoneNumber: "9075554011",
            createdAt: "2025-01-01T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
          },
        },
      },
    ]

    async function getTicketsIt(
      requestBody,
      expectedTickets = [],
      isPrinted = false
    ) {
      expectedTickets = Array.isArray(expectedTickets)
        ? expectedTickets
        : [expectedTickets]

      const { status, data: tickets } = await client.post(
        "/tickets/search",
        requestBody
      )

      if (isPrinted) {
        console.log("[")

        for (const ticket of tickets) console.log(ticket, "\n,")

        console.log("]")
      }

      expect(status).to.equal(OK)
      expect(tickets).to.be.jsonSchema(ticketsSchema)
      expect(tickets).to.eql(expectedTickets)
    }

    it("When no inputs is provided, Then default query search is returned ", async function () {
      await getTicketsIt({}, allTickets)
    })

    it("When client id is the only input, Then response all providers with the respectived id are returned", async function () {
      await getTicketsIt({ clientId: 2 }, allTickets[2])
    })

    it("When cost is the only input, Then response all providers with the respectived cost are returned", async function () {
      await getTicketsIt({ cost: 168.27 }, allTickets[0])
    })

    it("When payment plan is the only input, Then response all providers with the payment plan that includes the subtring entered", async function () {
      await getTicketsIt({ paymentPlan: "week" }, [
        allTickets[1],
        allTickets[2],
      ])
    })

    it("When description is the only input, Then response all providers with the description that includes the subtring entered", async function () {
      await getTicketsIt({ description: "" }, allTickets)
    })

    it("When a createdAt date object is given, Then response is all tickets within that same month and year", async function () {
      await getTicketsIt({ createdAt: { year: 2025, month: 0 } }, allTickets)
    })

    it("When a updatedAt date string is given, Then response is all tickets with the exact date given", async function () {
      await getTicketsIt({ updatedAt: new Date("2025-02-10") })
    })

    it("When a pending is given, Then response is all tickets that have not been paid in full are returned", async function () {
      await getTicketsIt({ pending: true }, [allTickets[1]])
    })

    it("When multiple inputs are given, Then response is all tickets that satisfy the input comparisons", async function () {
      await getTicketsIt(
        {
          clientId: 3,
          cost: 488.52,
          paymentPlan: "biweekly",
          description: "",
          soldAt: "2025-01-09T00:00:00.000Z",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
        allTickets[1]
      )
    })
  })

  describe("Post /", function () {
    it("When merchant inputs values for tickets data but not required warestickets input, Then response is bad request ", async function () {
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for tickets data and warestickets data with duplicate ware ids, Then response is bad request ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1 },
        { wareId: 5, amount: 1 },
        { wareId: 2, amount: 1 },
      ]
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for tickets data and warestickets data that contains a non-exisiting wareId, Then response is bad request ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1 },
        { wareId: 5, amount: 1 },
        { wareId: 700, amount: 1 },
      ]
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
        soldAt: new Date("2025-01-23").toISOString(),
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(NOT_FOUND)
      expect(data).to.equal("Ware not found.")
    })

    it("When merchant inputs values for tickets data and warestickets data that contains the total amount of ware sold than is in stock, Then response is bad request ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1 },
        { wareId: 5, amount: 1000 },
      ]
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for tickets data and warestickets data that contains the amount sold of a ware (excluding the returned amount) than is in stock, Then response is bad request ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1000, returned: 999 },
        { wareId: 5, amount: 1 },
      ]
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs values for tickets data and warestickets data that cocontains the more amount returned than was bought, Then response is bad request ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1, returned: 2 },
        { wareId: 5, amount: 1 },
      ]
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: Math.floor(Math.random() * 4) + 50,
        paymentPlan: "weekly",
        soldAt: new Date("2025-01-23"),
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When merchant inputs required values, Then ticket is created ", async function () {
      const waresTickets = [
        { wareId: 2, amount: 1 },
        { wareId: 5, amount: 2 },
      ]
      const soldAt = new Date("2025-01-23").toISOString()
      const requestBody = {
        clientId: 3,
        paymentPlan: "weekly",
        soldAt,
        waresTickets,
      }

      const { status, data } = await client.post("/tickets", requestBody)

      delete requestBody.waresTickets
      delete requestBody.soldAt
      const newTicketSearched = await models.Tickets.findOne({
        where: requestBody,
      })
      const newTicket = newTicketSearched.dataValues
      const newWaresTicketsSearched = await models.WaresTickets.findAll({
        where: { ticketId: newTicket.id },
      })
      const newWaresTickets = newWaresTicketsSearched.map((waresTicket) => {
        return waresTicket.dataValues
      })
      const newTicketDeleted = await models.Tickets.destroy({
        where: requestBody,
      })
      const waresTicketsDeleted = await models.WaresTickets.destroy({
        where: { ticketId: newTicket.id },
      })

      expect(status).to.equal(CREATED)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(" ticket has been created.")
      expect(newTicket).to.include(requestBody)
      expect(newTicket.soldAt.toISOString()).to.equal(soldAt)
      expect(newWaresTickets[0]).to.include(waresTickets[1])
      expect(newWaresTickets[1]).to.include(waresTickets[0])
      expect(newTicketDeleted).to.equal(1)
      expect(waresTicketsDeleted).to.equal(0)
    })
  })

  describe("Put /:ticketId", function () {
    it("When there are no inputs, Then response is bad request", async function () {
      const ticketId = Math.ceil(Math.random() * 2)
      const requestBody = {}

      const { status, data } = await client.put(
        "/tickets/" + ticketId,
        requestBody
      )

      expect(status).to.equal(BAD_REQUEST)
      expect(data).to.equal("Bad input request.")
    })

    it("When inputs are given, Then ticket has the respective information updated", async function () {
      const ticketBeforeCreated = await models.Tickets.create({
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 5) + 14,
        paymentPlan: ["weekly", "biweekly"][Math.floor(Math.random() * 2)],
        soldAt: new Date("2023-01-23"),
      })
      const ticketBefore = ticketBeforeCreated.dataValues
      const ticketId = ticketBefore.id
      const requestBody = {
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 5 + 9),
        paymentPlan: ["weekly", "lump-sum"][Math.floor(Math.random() * 2)],
        description: faker.lorem.sentence({ min: 3, max: 10 }),
        soldAt: new Date("2025-01-23").toISOString(),
      }

      const { status, data } = await client.put(
        "/tickets/" + ticketId,
        requestBody
      )

      const ticketAfterSearched = await models.Tickets.findOne({
        where: { id: ticketId },
      })
      const ticketAfter = ticketAfterSearched.dataValues
      ticketAfter.soldAt = ticketAfter.soldAt.toISOString()
      const ticketDeleted = await models.Tickets.destroy({
        where: { id: ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(` ticket with id = ${ticketId} was updated`)
      expect(ticketAfter).to.include(requestBody)
      expect(new Date(ticketBefore.updatedAt)).to.be.beforeTime(
        new Date(ticketAfter.updatedAt)
      )
      expect(ticketDeleted).to.equal(1)
    })
  })

  describe("Delete /:ticketId", function () {
    it("When taget ticket id exists, Then respective ticket is deleted ", async function () {
      const ticketCreated = await models.Tickets.create({
        clientId: Math.ceil(Math.random() * 3),
        cost: round(Math.random() * 50) + 170,
        paymentPlan: ["monthly", "biweekly"][Math.floor(Math.random() * 2)],
        soldAt: new Date("2025-01-12"),
      })
      const newTicket = ticketCreated.dataValues
      const ticketId = newTicket.id
      await models.WaresTickets.create({
        ticketId,
        wareId: 1,
        amount: 1,
      })
      await models.Transactions.create({
        ticketId,
        payment: 170,
        paymentType: "cash app",
        paidAt: new Date(),
      })

      const { status, data } = await client.delete("/tickets/" + ticketId)

      const afterTicketSearched = await models.Tickets.findOne({
        where: { id: ticketId },
      })
      const afterTransactionSearched = await models.Transactions.findOne({
        where: { ticketId },
      })
      const afterWareTicketSearched = await models.WaresTickets.findOne({
        where: { ticketId },
      })

      expect(status).to.equal(OK)
      expect(data)
        .to.include.string(preMerchantMsg)
        .and.string(
          ` has deleted a ticket with id = ${ticketId} and fullname = ${newTicket.fullname}.`
        )
      expect(afterTicketSearched).to.equal(null)
      expect(afterTransactionSearched).to.equal(null)
      expect(afterWareTicketSearched).to.equal(null)
    })
  })
})
