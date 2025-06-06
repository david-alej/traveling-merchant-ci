const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersInclusion = {
  model: models.Orders,
  as: "order",
}

const waresInclusion = {
  model: models.Wares,
  as: "ware",
}

const findOrdersWareQuery = {
  include: [ordersInclusion, waresInclusion],
  order: [
    ["orderId", "DESC"],
    ["wareId", "DESC"],
  ],
}
exports.findOrdersWareQuery = findOrdersWareQuery

exports.parseOrdersWareInputs = (req, otherOptions = findOrdersWareQuery) => {
  return parseInputs(req, otherOptions)
}
