"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Providers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Providers.hasMany(models.Orders, {
        foreignKey: "providerId",
        as: "orders",
      })
    }
  }
  Providers.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Providers",
    }
  )
  return Providers
}
