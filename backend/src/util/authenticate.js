const bcrypt = require("bcrypt")
const models = require("../database/models")

const authenticate = async (username, password) => {
  let merchant = await models.Merchant.findOne({
    where: {
      username,
    },
  })

  merchant = JSON.parse(JSON.stringify(merchant))

  if (!merchant) return merchant, false

  const authorized = await bcrypt.compare(password, merchant.password)

  return { merchant, authorized }
}

exports.authenticate = authenticate
