const { validationPerusal } = require("../util/index").validators
const { generateToken } = require("../util/index").doubleCsrf
const { authenticate } = require("../util/index").authenticate
const { Api401Error, Api429Error } = require("../util/index").apiErrors
const {
  getSlowBruteLimiter,
  getConsecutveFailsLimiter,
  maxWrongAttemptsByIPperDay,
  maxConsecutiveFailsByUsernameAndIP,
} = require("../util/index").rateLimiters

const getUsernameIPkey = (username, ip) => `${username}_${ip}`

exports.postLogin = async (req, res, next) => {
  const ipAddr = req.ip
  const { username, password } = req.body
  const usernameIPkey = getUsernameIPkey(username, ipAddr)
  req.session.merchant = { preMsg: "Client:" }

  try {
    validationPerusal(req)

    const consecutveFailsLimiter = await getConsecutveFailsLimiter()
    const slowBruteLimiter = await getSlowBruteLimiter()

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
      consecutveFailsLimiter.get(usernameIPkey),
      slowBruteLimiter.get(ipAddr),
    ])

    let retryMS = 0

    if (
      resSlowByIP !== null &&
      resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
    ) {
      retryMS = resSlowByIP.msBeforeNext
    } else if (
      resUsernameAndIP !== null &&
      resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
    ) {
      retryMS = resUsernameAndIP.msBeforeNext
    }

    if (retryMS > 0) {
      throw { msBeforeNext: retryMS }
    }

    const { merchant, authorized } = await authenticate(username, password)

    if (merchant) delete merchant.password

    if (!authorized) {
      let errorMsg = `Client: username ${username} not found.`
      const promises = [slowBruteLimiter.consume(ipAddr)]

      if (merchant) {
        errorMsg = `Client: with chosen user id ${merchant.id} has input an incorrect password.`

        promises.push(consecutveFailsLimiter.consume(usernameIPkey))
      }

      await Promise.all(promises)

      throw new Api401Error(errorMsg)
    }

    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
      await consecutveFailsLimiter.delete(usernameIPkey)
    }

    merchant.preMsg = `Merchant: ${merchant.id}`

    req.session.merchant = merchant

    req.session.authorized = authorized

    const csrfToken = generateToken(req, res, true)

    res.send({
      message: merchant.preMsg + " is now logged in.",
      csrfToken,
    })
  } catch (err) {
    if (typeof err.msBeforeNext === "undefined") return next(err)

    const preMsg =
      typeof req.session.merchant !== "undefined"
        ? req.session.merchant.preMsg
        : "Client:"

    const retrySecs = Math.round(err.msBeforeNext / 1000) || 1

    const afterErrorMsg = ` has made to many request to the original url, ${req.originalUrl}, next retry is after ${retrySecs} seconds.`

    next(new Api429Error(preMsg + afterErrorMsg))
  }
}
