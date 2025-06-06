const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ticketsInclusion = {
  model: models.Tickets,
  as: "tickets",
  order: [["id", "DESC"]],
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
            "ticketId" = "tickets"."id" )`
        ),
        "returned",
      ],
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT COALESCE(SUM("payment"), 0) FROM "Transactions" WHERE "ticketId" = "tickets"."id")'
        ),
        "paid",
      ],
    ],
  },
}

const workInclusion = {
  model: models.Works,
  as: "work",
}

exports.findClientQuery = {
  include: [workInclusion, ticketsInclusion],
}

exports.parseClientInputs = (
  inputsObject,
  includeOptions = {
    include: [ticketsInclusion, workInclusion],
    order: [["id", "DESC"]],
  }
) => {
  return parseInputs(inputsObject, includeOptions)
}
