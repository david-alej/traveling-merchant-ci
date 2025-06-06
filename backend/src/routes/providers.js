const providersRouter = require("express").Router()
const { providersControllers } = require("../controllers/index")
const {
  stringValidator,
  wordValidator,
  searchDateValidator,
  phoneNumberValidator,
  emailValidator,
} = require("../util/index").validators

providersRouter.param("providerId", providersControllers.paramProviderId)

providersRouter.get("/:providerId", providersControllers.getProvider)

providersRouter.post(
  "/search",
  [
    stringValidator("name", true),
    stringValidator("address", true),
    stringValidator("phoneNumber", true),
    stringValidator("email", true),
    searchDateValidator("createdAt", true),
    searchDateValidator("updatedAt", true),
  ],
  providersControllers.getProviders
)

providersRouter.post(
  "/",
  [
    wordValidator("name"),
    wordValidator("address"),
    phoneNumberValidator("phoneNumber"),
    emailValidator("email", true),
  ],
  providersControllers.postProvider
)

providersRouter.put(
  "/:providerId",
  [
    wordValidator("name", true),
    wordValidator("address", true),
    phoneNumberValidator("phoneNumber", true),
    emailValidator("email", true),
  ],
  providersControllers.putProvider
)

providersRouter.delete("/:providerId", providersControllers.deleteProvider)

module.exports = providersRouter
