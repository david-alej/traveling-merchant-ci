const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const providersInclusion = {
  model: models.Providers,
  as: "provider",
}

const transactionsInclusion = {
  model: models.Transactions,
  as: "transactions",
}

const ordersWaresInclusion = {
  model: models.OrdersWares,
  as: "ordersWares",
  attributes: { exlcude: ["id"] },
  include: {
    model: models.Wares,
    as: "ware",
    attributes: {
      include: [
        [
          models.Sequelize.literal(
            // eslint-disable-next-line quotes
            '(SELECT SUM("OrdersWares"."amount" - "OrdersWares"."returned" + COALESCE("WaresTickets"."returned"  - "WaresTickets"."amount", 0) )::integer FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" LEFT OUTER JOIN "WaresTickets" ON "OrdersWares"."wareId" = "WaresTickets"."wareId"  WHERE "OrdersWares"."wareId" = "ordersWares->ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
          ),
          "stock",
        ],
      ],
    },
    // '(SELECT "amount" - "returned" + COALESCE     ("ordersWares->ware->waresTickets"."returned"  - "ordersWares->ware->waresTickets"."amount", 0) FROM "OrdersWares" LEFT OUTER JOIN "Orders" ON "OrdersWares"."orderId" = "Orders"."id" WHERE "wareId" = "ordersWares->ware"."id" AND "Orders"."actualAt" IS NOT NULL)'
    //       ),
    //       "stock",
    //     ],
    //   ],
    // },
    // include: {
    //   model: models.WaresTickets,
    //   as: "waresTickets",
    //   attributes: { exlcude: ["id"] },
    // },
  },
  order: [
    ["id", "DESC"],
    ["waresTickets", "ticketId", "DESC"],
  ],
}

exports.findWaresQuery = (wareId) => ({
  where: { id: wareId },
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

const findOrderQuery = {
  attributes: {
    include: [
      [
        models.Sequelize.literal(
          // eslint-disable-next-line quotes
          `( SELECT
            SUM("returned" * "unitPrice")
          FROM
            "OrdersWares"
          WHERE 
            "orderId" = "Orders"."id" )`
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
            "orderId" = "Orders"."id" )`
        ),
        "paid",
      ],
    ],
  },
  include: [providersInclusion, transactionsInclusion, ordersWaresInclusion],
  order: [
    ["id", "DESC"],
    ["transactions", "id", "DESC"],
    ["ordersWares", "id", "DESC"],
  ],
}

exports.findOrderQuery = findOrderQuery

exports.parseOrderInputs = (inputsObject, otherOptions = findOrderQuery) => {
  return parseInputs(inputsObject, otherOptions)
}
