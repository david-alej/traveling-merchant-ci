"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Wares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wares.hasMany(models.WaresTickets, {
        foreignKey: "wareId",
        as: "waresTickets",
      })

      Wares.hasMany(models.OrdersWares, {
        foreignKey: "wareId",
        as: "ordersWares",
      })

      Wares.belongsToMany(models.Tickets, {
        foreignKey: "wareId",
        as: "tickets",
        through: models.WaresTickets,
      })
    }
  }
  Wares.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      tags: DataTypes.ARRAY(DataTypes.STRING),
      unitPrice: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Wares",
    }
  )
  return Wares
}
