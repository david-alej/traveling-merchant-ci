"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("WaresTickets", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: false,
      },
      wareId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticketId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: { model: "Tickets", key: "id" },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("WaresTickets")
  },
}
