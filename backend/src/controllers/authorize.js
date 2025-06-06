const { Api401Error } = require("../util/index").apiErrors

exports.authorizedUser = (req, res, next) => {
  if (req.session.authorized) {
    next()
    return
  }

  throw new Api401Error(
    req.ip + " needs to login to view this page.",
    "Client needs to login to view this page."
  )
}
