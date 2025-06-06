"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Works extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Works.hasMany(models.Clients, {
        foreignKey: "workId",
        as: "clients",
      })
    }
  }
  Works.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Works",
    }
  )
  return Works
}
