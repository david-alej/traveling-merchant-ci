"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transactions.belongsTo(models.Tickets, {
        foreignKey: "ticketId",
        as: "ticket",
      })

      Transactions.belongsTo(models.Orders, {
        foreignKey: "orderId",
        as: "order",
      })
    }
  }
  Transactions.init(
    {
      ticketId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      payment: DataTypes.FLOAT,
      paymentType: DataTypes.STRING,
      paidAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  )
  return Transactions
}
