const waresRouter = require("express").Router()
const { waresControllers } = require("../controllers/index")
const {
  arrayTextValidator,
  dateValidator,
  positiveFloatValidator,
  wordValidator,
  stringValidator,
  nonNegativeIntegerValidator,
} = require("../util/index").validators

waresRouter.param("wareId", waresControllers.paramWareId)

waresRouter.get("/:wareId", waresControllers.getWare)

waresRouter.post(
  "/search",
  [
    stringValidator("name", true),
    stringValidator("type", true),
    arrayTextValidator("tags", true),
    positiveFloatValidator("unitPrice", true),
    dateValidator("createdAt", true),
    dateValidator("updatedAt", true),
    nonNegativeIntegerValidator("stock", true),
  ],
  waresControllers.getWares
)

waresRouter.post(
  "/",
  [
    wordValidator("name"),
    wordValidator("type"),
    arrayTextValidator("tags", true),
    positiveFloatValidator("unitPrice"),
  ],
  waresControllers.postWare
)

waresRouter.put(
  "/:wareId",
  [
    wordValidator("name", true),
    wordValidator("type", true),
    arrayTextValidator("tags", true),
    positiveFloatValidator("unitPrice", true),
  ],
  waresControllers.putWare
)

waresRouter.delete("/:wareId", waresControllers.deleteWare)

module.exports = waresRouter
