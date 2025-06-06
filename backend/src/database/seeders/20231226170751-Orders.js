"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          providerId: 1,
          cost: 3413.65,
          tax: 283.65,
          shipment: 50,
          expectedAt: new Date("2025-01-08"),
          actualAt: new Date("2025-01-09"),
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          providerId: 2,
          cost: 959.59,
          tax: 89.59,
          shipment: 20,
          expectedAt: new Date("2025-01-09"),
          actualAt: new Date("2025-01-09"),
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-17"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {})
  },
}
