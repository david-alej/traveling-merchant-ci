const { doubleCsrf } = require("csrf-csrf")
require("dotenv").config()

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: (req) => req.secret,
    secret: process.env.CSRF_SECRET,
    cookieName: process.env.CSRF_COOKIE_NAME,
    cookieOptions: {
      maxAge: 1000 * 60 * 30,
      sameSite: process.env.NODE_ENV === "production", // ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      signed: true,
    },
  })

module.exports = {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
}
