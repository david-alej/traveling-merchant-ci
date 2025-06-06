"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.Providers, {
        foreignKey: "providerId",
        as: "provider",
      })

      Orders.hasMany(models.OrdersWares, {
        foreignKey: "orderId",
        as: "ordersWares",
        onDelete: "CASCADE",
      })

      Orders.hasMany(models.Transactions, {
        foreignKey: "orderId",
        as: "transactions",
        onDelete: "CASCADE",
      })
    }
  }
  Orders.init(
    {
      providerId: DataTypes.INTEGER,
      cost: DataTypes.FLOAT,
      tax: DataTypes.FLOAT,
      shipment: DataTypes.FLOAT,
      expectedAt: DataTypes.DATE,
      actualAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Orders",
    }
  )
  return Orders
}
