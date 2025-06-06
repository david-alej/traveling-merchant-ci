const { generateToken } = require("../util/index").doubleCsrf

exports.postLogout = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    req.session.authorized = false

    req.session.merchant = {}

    generateToken(req, res, true)

    res.send(merchant.preMsg + " is now logged out.")
  } catch (err) {
    next(err)
  }
}
