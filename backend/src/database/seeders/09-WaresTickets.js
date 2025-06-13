"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "WaresTickets",
      [
        {
          ticketId: 1,
          wareId: 1,
          amount: 1,
          returned: 1,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          ticketId: 1,
          wareId: 2,
          amount: 1,
          returned: 0,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          ticketId: 1,
          wareId: 5,
          amount: 2,
          returned: 0,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          ticketId: 2,
          wareId: 3,
          amount: 1,
          returned: 0,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          ticketId: 3,
          wareId: 1,
          amount: 1,
          returned: 1,
          createdAt: new Date("2025-01-13"),
          updatedAt: new Date("2025-01-13"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("WaresTickets", null, {})
  },
}
