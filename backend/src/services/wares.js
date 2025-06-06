const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "ordersWares",
}

const waresTicketsInclusion = { model: models.WaresTickets, as: "waresTickets" }

const findWareQuery = {
  include: [ordersWaresInclusion, waresTicketsInclusion],
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          '(SELECT SUM("OrdersWares"."amount" - "OrdersWares"."returned" + COALESCE("WaresTickets"."returned"  - "WaresTickets"."amount", 0) )::integer FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" LEFT OUTER JOIN "WaresTickets" ON "OrdersWares"."wareId" = "WaresTickets"."wareId"  WHERE "OrdersWares"."wareId" = "Wares"."id" AND "Orders"."actualAt" IS NOT NULL)'
        ),
        "stock",
      ],
    ],
  },
  order: [
    ["id", "DESC"],
    ["ordersWares", "orderId", "DESC"],
    ["ordersWares", "wareId", "DESC"],
    ["waresTickets", "ticketId", "DESC"],
    ["waresTickets", "wareId", "DESC"],
  ],
}

exports.findWareQuery = findWareQuery

exports.parseWareInputs = (req, otherOptions = findWareQuery) => {
  return parseInputs(req, otherOptions)
}
