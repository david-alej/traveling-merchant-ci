const express = require("express")
const merchantRouter = express.Router()
const { merchantControllers } = require("../controllers/index")
const { credentialsValidator, newCredentialsValidator } =
  require("../util/index").validators

merchantRouter.param("merchantId", merchantControllers.paramMerchantId)

merchantRouter.get("/:merchantId", merchantControllers.getMerchant)

merchantRouter.put(
  "/:merchantId",
  credentialsValidator(),
  newCredentialsValidator(),
  merchantControllers.putMerchant
)

module.exports = merchantRouter
