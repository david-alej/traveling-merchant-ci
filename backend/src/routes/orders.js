const ordersRouter = require("express").Router()
const { ordersControllers } = require("../controllers/index")
const { booleanValidator, searchDateValidator } = require("../util/validators")
const {
  positiveIntegerValidator,
  nonNegativeFloatValidator,
  dateValidator,
  arrayObjectValidator,
} = require("../util/index").validators

ordersRouter.param("orderId", ordersControllers.paramOrderId)

ordersRouter.get("/:orderId", ordersControllers.getOrder)

ordersRouter.post(
  "/search",
  [
    positiveIntegerValidator("providerId", true),
    nonNegativeFloatValidator("cost", true),
    nonNegativeFloatValidator("tax", true),
    nonNegativeFloatValidator("shipment", true),
    searchDateValidator("expectedAt", true),
    searchDateValidator("actualAt", true),
    searchDateValidator("createdAt", true),
    searchDateValidator("updatedAt", true),
    booleanValidator("pending", true),
  ],
  ordersControllers.getOrders
)

ordersRouter.post(
  "/",
  [
    nonNegativeFloatValidator("cost"),
    nonNegativeFloatValidator("tax", true),
    nonNegativeFloatValidator("shipment", true),
    dateValidator("expectedAt"),
    dateValidator("actualAt", true),
    arrayObjectValidator("ordersWares"),
  ],
  ordersControllers.postValidation,
  ordersControllers.postOrder
)

ordersRouter.put(
  "/:orderId",
  [
    positiveIntegerValidator("providerId", true),
    nonNegativeFloatValidator("cost", true),
    nonNegativeFloatValidator("tax", true),
    nonNegativeFloatValidator("shipment", true),
    dateValidator("expectedAt", true),
    dateValidator("actualAt", true),
  ],
  ordersControllers.putOrder
)

ordersRouter.delete("/:orderId", ordersControllers.deleteOrder)

module.exports = ordersRouter
