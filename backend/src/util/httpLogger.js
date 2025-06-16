const morgan = require("morgan")
const chalk = require("chalk")

// const format = json({
//   method: ":method",
//   url: ":url",
//   status: ":status",
//   contentLength: ":res[content-length]",
//   responseTime: ":response-time",
// })
// const format = (tokens, req, res) => {
//   return JSON.stringify({
//     method: tokens.method(req, res),
//     url: tokens.url(req, res),
//     status: tokens.status(req, res),
//     contentLength: tokens.res(req, res, "content-length"),
//     responseTime: tokens["response-time"](req, res),
//   })
// }

function colorStatus(status) {
  status = Number(status)
  if (status >= 500) return chalk.red(status)
  if (status >= 400) return chalk.yellow(status)
  if (status >= 300) return chalk.white(status)
  return chalk.green(status)
}

const format = (tokens, req, res) => {
  const method = chalk.blue(tokens.method(req, res))
  const url = chalk.cyan(tokens.url(req, res))
  const status = colorStatus(tokens.status(req, res))
  const responseTime = chalk.magenta(`${tokens["response-time"](req, res)}ms`)

  return [method, url, status, responseTime].join(" ")
}

const logger = require("./logger")
const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      logger.info(message.trim())
    },
  },
})
// const httpLogger = morgan(format, {
//   stream: {
//     write: (message) => {
//       const { method, url, status, contentLength, responseTime } =
//         JSON.parse(message)

//       logger.info("HTTP Access Log", {
//         timestamp: new Date().toString(),
//         method,
//         url,
//         status: Number(status),
//         contentLength,
//         responseTime: Number(responseTime),
//       })
//     },
//   },
// })

module.exports = httpLogger
