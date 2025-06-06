const models = require("../database/models")
const { parseInputs } = require("../util/index").parseInputs

const clientsInclusion = {
  model: models.Clients,
  as: "clients",
  order: [["id", "DESC"]],
}

exports.findWorkQuery = { include: [clientsInclusion] }

exports.parseWorkInputs = (
  req,
  includeOptions = {
    include: [clientsInclusion],
    order: [
      ["id", "DESC"],
      ["clients", "id", "DESC"],
    ],
  }
) => {
  return parseInputs(req, includeOptions)
}
