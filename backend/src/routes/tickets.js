const ticketsRouter = require("express").Router()
const { ticketsControllers } = require("../controllers/index")
const { dateValidator } = require("../util/validators")
const {
  arrayObjectValidator,
  booleanValidator,
  positiveIntegerValidator,
  wordValidator,
  stringValidator,
  nonNegativeFloatValidator,
  searchDateValidator,
} = require("../util/index").validators

ticketsRouter.param("ticketId", ticketsControllers.paramTicketId)

ticketsRouter.get("/:ticketId", ticketsControllers.getTicket)

ticketsRouter.post(
  "/search",
  [
    positiveIntegerValidator("clientId", true),
    nonNegativeFloatValidator("cost", true),
    stringValidator("paymentPlan", true),
    stringValidator("description", true),
    searchDateValidator("soldAt"),
    searchDateValidator("createdAt"),
    searchDateValidator("updatedAt"),
    booleanValidator("pending", true),
  ],
  ticketsControllers.getTickets
)

ticketsRouter.post(
  "/",
  [
    positiveIntegerValidator("clientId"),
    nonNegativeFloatValidator("cost", true),
    wordValidator("paymentPlan"),
    stringValidator("description", true),
    dateValidator("soldAt"),
    arrayObjectValidator("waresTickets"),
  ],
  ticketsControllers.postValidation,
  ticketsControllers.postTicket
)

ticketsRouter.put(
  "/:ticketId",
  [
    positiveIntegerValidator("clientId", true),
    nonNegativeFloatValidator("cost", true),
    wordValidator("paymentPlan", true),
    stringValidator("description", true),
    dateValidator("soldAt", true),
  ],
  ticketsControllers.putTicket
)

ticketsRouter.delete("/:ticketId", ticketsControllers.deleteTicket)

module.exports = ticketsRouter
