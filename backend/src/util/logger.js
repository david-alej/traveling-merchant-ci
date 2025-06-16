const { createLogger, format, config, transports } = require("winston")
const chalk = require("chalk")

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      let color = chalk.white

      if (level === "error") {
        color = chalk.red
      } else if (level === "warn") {
        color = chalk.yellow
      } else if (level === "info") {
        color = chalk.green
      }

      return `${chalk.gray(`[${timestamp}]`)} ${color(level)}: ${message}`
    })
  ),
  levels: config.npm.levels,
  transports: [new transports.Console(options.console)],
  exitOnError: false,
})

// const logger = createLogger({
//   levels: config.npm.levels,
//   transports: [new transports.Console(options.console)],
//   exitOnError: false,
// })

module.exports = logger
