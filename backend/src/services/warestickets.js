const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ticketsInclusion = {
  model: models.Tickets,
  as: "ticket",
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
            "ticketId" = "ticket"."id" )`
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
            "ticketId" = "ticket"."id" )`
        ),
        "paid",
      ],
    ],
  },
}

const waresInclusion = {
  model: models.Wares,
  as: "ware",
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT "amount" - "returned" + COALESCE("WaresTickets"."returned"  - "WaresTickets"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
        ),
        "stock",
      ],
    ],
  },
}

const findWaresTicketQuery = {
  include: [ticketsInclusion, waresInclusion],
  order: [
    ["ticketId", "DESC"],
    ["wareId", "DESC"],
  ],
}

exports.findWaresTicketQuery = findWaresTicketQuery

exports.parseWaresTicketInputs = (req, otherOptions = findWaresTicketQuery) => {
  return parseInputs(req, otherOptions)
}
