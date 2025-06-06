const waresticketsRouter = require("express").Router()
const { waresticketsControllers } = require("../controllers/index")
const { searchDateValidator } = require("../util/validators")
const { positiveIntegerValidator, nonNegativeIntegerValidator } =
  require("../util/index").validators

waresticketsRouter.param("ticketId", waresticketsControllers.paramTicketId)

waresticketsRouter.param("wareId", waresticketsControllers.paramWareId)

waresticketsRouter.get(
  "/:ticketId/:wareId",
  waresticketsControllers.getWaresTicket
)

waresticketsRouter.post(
  "/search",
  [
    positiveIntegerValidator("wareId", true),
    positiveIntegerValidator("ticketId", true),
    positiveIntegerValidator("amount", true),
    nonNegativeIntegerValidator("returned", true),
    searchDateValidator("createdAt", true),
    searchDateValidator("updatedAt", true),
  ],
  waresticketsControllers.getWaresTickets
)

waresticketsRouter.post(
  "/",
  [
    positiveIntegerValidator("wareId"),
    positiveIntegerValidator("ticketId"),
    positiveIntegerValidator("amount"),
    nonNegativeIntegerValidator("returned", true),
  ],
  waresticketsControllers.postWaresTicket
)

waresticketsRouter.put(
  "/:ticketId/:wareId",
  [
    positiveIntegerValidator("amount", true),
    nonNegativeIntegerValidator("returned", true),
  ],
  waresticketsControllers.putWaresTicket
)

waresticketsRouter.delete(
  "/:ticketId/:wareId",
  waresticketsControllers.deleteWaresTicket
)

waresticketsRouter.delete(
  "/:ticketId",
  waresticketsControllers.deleteWaresTickets
)

module.exports = waresticketsRouter
