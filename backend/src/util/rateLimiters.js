const Redis = require("./Redis")

const { RateLimiterMemory } = require("rate-limiter-flexible")

const maxWrongAttemptsByIPperDay = 100
const maxConsecutiveFailsByUsernameAndIP = 10

exports.maxWrongAttemptsByIPperDay = maxWrongAttemptsByIPperDay
exports.maxConsecutiveFailsByUsernameAndIP = maxConsecutiveFailsByUsernameAndIP

const oneHour = process.env.NODE_ENV === "production" ? 60 * 60 : 1
const oneDay = process.env.NODE_ENV === "production" ? 60 * 60 * 24 : 1
const ninetyDays = process.env.NODE_ENV === "production" ? 60 * 60 * 24 * 90 : 1

const bruteRateLimiterMemory = new RateLimiterMemory({
  points: 60,
  duration: oneDay,
})

const slowBruteOptions = {
  keyPrefix: "login_fail_ip_per_day",
  points: maxWrongAttemptsByIPperDay,
  duration: oneDay,
  blockDuration: oneDay,
  inMemoryBlockOnConsumed: maxWrongAttemptsByIPperDay + 1,
  inMemoryBlockDuration: oneDay,
}

exports.slowBruteOptions = slowBruteOptions

exports.getSlowBruteLimiter = async () =>
  Redis.createRateLimiter({
    useRedisPackage: true,
    insuranceLimiter: bruteRateLimiterMemory,
    ...slowBruteOptions,
  })

const consecutiveRateLimiterMemory = new RateLimiterMemory({
  points: 60,
  duration: oneDay * 23,
})

const consecutiveFailsOptions = {
  keyPrefix: "login_fail_consecutive_username_and_ip",
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: ninetyDays,
  blockDuration: oneHour,
  inMemoryBlockOnConsumed: maxConsecutiveFailsByUsernameAndIP + 1,
  inMemoryBlockDuration: oneHour,
}

exports.consecutiveFailsOptions = consecutiveFailsOptions

exports.getConsecutveFailsLimiter = async () =>
  Redis.createRateLimiter({
    insuranceLimiter: consecutiveRateLimiterMemory,
    ...consecutiveFailsOptions,
  })
