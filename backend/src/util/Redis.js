const { Api500Error } = require("./apiErrors")

const { RateLimiterRedis } = require("rate-limiter-flexible")
const redis = require("redis")

require("dotenv").config()

class Redis {
  constructor() {
    this.host = process.env.REDIS_HOST || "localhost"
    this.port = process.env.REDIS_PORT || "6379"
    this.connected = false
    this.client = null
  }

  async getConnection() {
    if (this.connected) {
      return this.client
    } else {
      this.client = redis.createClient({
        socket: { host: this.host, port: this.port },
      })

      this.client.on("error", (error) => {
        throw new Error(`Redis Error: ${error.message}`)
      })

      await this.client.connect()

      this.connected = true

      return this.client
    }
  }

  async createRateLimiter(options) {
    if (typeof options !== "object") {
      throw new Api500Error(
        "Redis.createRateLimiter has an input that is not an object"
      )
    }

    if (!this.connected) await this.getConnection()

    return new RateLimiterRedis({
      storeClient: this.client,
      ...options,
    })
  }
}

module.exports = new Redis()
