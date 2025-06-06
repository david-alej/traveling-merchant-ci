"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clients.belongsTo(models.Works, {
        foreignKey: "workId",
        as: "work",
      })

      Clients.hasMany(models.Tickets, {
        foreignKey: "clientId",
        as: "tickets",
      })
    }
  }
  Clients.init(
    {
      workId: DataTypes.INTEGER,
      fullname: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Clients",
    }
  )
  return Clients
}
