const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const ordersInclusion = {
  model: models.Orders,
  as: "orders",
}

const findProviderQuery = {
  include: [ordersInclusion],
  order: [
    ["id", "DESC"],
    ["orders", "id", "DESC"],
  ],
}
exports.findProviderQuery = findProviderQuery

exports.parseProviderInputs = (
  inputsObject,
  otherOptions = findProviderQuery
) => {
  return parseInputs(inputsObject, otherOptions)
}
