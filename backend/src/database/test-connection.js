const { Sequelize } = require("sequelize")

// Replace with your actual values
const sequelize = new Sequelize(config.url, config)

async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log("✅ Connection has been established successfully.")
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message)
  } finally {
    await sequelize.close()
  }
}

testConnection()
