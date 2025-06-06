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
          '(SELECT COALESCE(SUM("payment"), 0) FROM "Transactions" WHERE "ticketId" = "ticket"."id")'
        ),
        "paid",
      ],
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          `(
          SELECT
            SUM("returned" * "ware"."unitPrice")
          FROM
            "WaresTickets"
          LEFT OUTER JOIN 
            "Wares" AS "ware" ON "wareId" = "ware"."id" 
          WHERE 
            "ticketId" = "ticket"."id" 
          )`
        ),
        "returned",
      ],
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
    ],
  },
}

const ordersInlcusion = {
  model: models.Orders,
  as: "order",
}

const findTransactionQuery = {
  include: [ticketsInclusion, ordersInlcusion],
  order: [["id", "DESC"]],
}

exports.findTransactionQuery = findTransactionQuery

exports.parseTransactionInputs = (req, otherOptions = findTransactionQuery) => {
  return parseInputs(req, otherOptions)
}
