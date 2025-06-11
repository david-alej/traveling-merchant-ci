const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { authenticate } = require("../util/index").authenticate
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { passwordHash } = require("../util/index").passwordHash
const { generateToken } = require("../util/index").doubleCsrf

const otherOptions = {
  attributes: { exclude: ["password"] },
  order: [["id", "DESC"]],
}

exports.paramMerchantId = async (req, res, next, merchantId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("merchantId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Merchant.findOne({
      where: { id: merchantId },
      ...otherOptions,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target merchant ${merchantId} not found.`,
        "Merchant not found."
      )
    }

    req.targetMerchant = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getMerchant = async (req, res) => res.json(req.targetMerchant)

exports.putMerchant = async (req, res, next) => {
  const merchant = req.session.merchant
  const saltRounds = 10

  try {
    validationPerusal(req)

    const { username, password, newUsername, newPassword } = req.body

    if (!newUsername && !newPassword) {
      throw new Api400Error(merchant.preMsg + " did not update any values.")
    }

    if (newUsername) {
      const searched = await models.Merchant.findOne({
        where: { username: newUsername },
      })

      if (searched) {
        throw new Api400Error(
          merchant.preMsg + ` new username, ${newUsername}, is already in use.`
        )
      }
    }

    await authenticate(username, password)

    const updatedValues = {}

    updatedValues.username = newUsername

    if (newPassword) {
      const hashedNewPassword = await passwordHash(newPassword, saltRounds)

      updatedValues.password = hashedNewPassword
    }

    const [updated] = await models.Merchant.update(updatedValues, {
      where: { id: merchant.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update merchant query did not work."
      )
    }

    req.session.authorized = false

    generateToken(req, res, true)

    res.send(
      merchant.preMsg + " has updated either/both their username or password."
    )
  } catch (err) {
    next(err)
  }
}
