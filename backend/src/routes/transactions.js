const transactionsRouter = require("express").Router()
const { transactionsControllers } = require("../controllers/index")
const { searchDateValidator } = require("../util/validators")
const {
  positiveIntegerValidator,
  floatValidator,
  wordValidator,
  stringValidator,
  dateValidator,
} = require("../util/index").validators

transactionsRouter.param(
  "transactionId",
  transactionsControllers.paramTransactionId
)

transactionsRouter.get(
  "/:transactionId",
  transactionsControllers.getTransaction
)

transactionsRouter.post(
  "/search",
  [
    positiveIntegerValidator("ticketId", true),
    positiveIntegerValidator("orderId", true),
    floatValidator("payment", true),
    stringValidator("paymentType", true),
    searchDateValidator("paidAt"),
    searchDateValidator("createdAt"),
    searchDateValidator("updatedAt"),
  ],
  transactionsControllers.getTransactions
)

transactionsRouter.post(
  "/",
  [
    positiveIntegerValidator("ticketId", true),
    positiveIntegerValidator("orderId", true),
    floatValidator("payment"),
    wordValidator("paymentType"),
    dateValidator("paidAt"),
  ],
  transactionsControllers.foreignKeyValidation(),
  transactionsControllers.postTransaction
)

transactionsRouter.put(
  "/:transactionId",
  [
    positiveIntegerValidator("ticketId", true),
    positiveIntegerValidator("orderId", true),
    floatValidator("payment", true),
    wordValidator("paymentType", true),
    dateValidator("paidAt", true),
  ],
  transactionsControllers.foreignKeyValidation(false),
  transactionsControllers.putTransaction
)

transactionsRouter.delete(
  "/:transactionId",
  transactionsControllers.deleteTransaction
)

module.exports = transactionsRouter
