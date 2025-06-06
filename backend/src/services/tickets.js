const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const clientsInclusion = {
  model: models.Clients,
  as: "client",
  include: {
    model: models.Works,
    as: "work",
  },
}

const transactionsInclusion = {
  model: models.Transactions,
  as: "transactions",
}

const waresTicketsInclusion = {
  model: models.WaresTickets,
  as: "waresTickets",
  attributes: { exclude: ["id"] },
  include: {
    model: models.Wares,
    as: "ware",
    attributes: {
      include: [
        [
          models.Sequelize.literal(
            // eslint-disable-next-line quotes
            '(SELECT "amount" - "returned" + COALESCE("waresTickets"."returned"  - "waresTickets"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "waresTickets->ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
          ),
          "stock",
        ],
        "unitPrice",
      ],
    },
  },
}

exports.findWaresQuery = (wareId) => ({
  where: { id: wareId },
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "amount" - "returned" + COALESCE("waresTickets"."returned"  - "waresTickets"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "Wares"."id" AND "Orders"."actualAt" IS NOT NULL)'
        ),
        "stock",
      ],
    ],
  },
  include: [
    {
      model: models.WaresTickets,
      as: "waresTickets",
    },
    {
      model: models.OrdersWares,
      as: "ordersWares",
    },
  ],
  order: [["id", "DESC"]],
})

const findTicketQuery = {
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          `( SELECT
            SUM("returned" * "ware"."unitPrice")
          FROM
            "WaresTickets"
          LEFT OUTER JOIN 
            "Wares" AS "ware" ON "wareId" = "ware"."id" 
          WHERE 
            "ticketId" = "Tickets"."id" )`
        ),
        "returned",
      ],
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          `( SELECT 
            COALESCE(SUM("payment"), 0)
          FROM 
            "Transactions" 
          WHERE 
            "ticketId" = "Tickets"."id" )`
        ),
        "paid",
      ],
    ],
  },
  include: [waresTicketsInclusion, transactionsInclusion, clientsInclusion],
  order: [
    ["id", "DESC"],
    ["transactions", "id", "DESC"],
    ["waresTickets", "wareId", "DESC"],
    ["waresTickets", "ware", "unitPrice", "DESC"],
  ],
}

exports.findTicketQuery = findTicketQuery

exports.parseTicketInputs = (req, otherOptions = findTicketQuery) => {
  return parseInputs(req, otherOptions)
}
