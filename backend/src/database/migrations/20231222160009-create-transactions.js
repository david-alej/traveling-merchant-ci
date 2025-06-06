"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticketId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Tickets", key: "id" },
        onDelete: "CASCADE",
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Orders", key: "id" },
        onDelete: "CASCADE",
      },
      payment: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable("Transactions")
  },
}
