"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      providerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tax: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      shipment: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      expectedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      actualAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders")
  },
}
