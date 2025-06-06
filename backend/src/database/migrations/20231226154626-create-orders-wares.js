"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrdersWares", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: false,
      },
      wareId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: "Orders", key: "id" },
        onDelete: "CASCADE",
      },
      unitPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      returned: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("OrdersWares")
  },
}
