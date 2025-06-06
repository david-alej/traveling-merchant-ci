"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Works",
      [
        {
          name: "Hamill, Denesik and Davis",
          address: "38 Galvin Ave.",
          phoneNumber: "9075554011",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "Deckow and Sons",
          address: "245 John Drive",
          phoneNumber: "7644084620",
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "Lynch PLC",
          address: "38 Lafayette St.",
          phoneNumber: "9103623505",
          createdAt: new Date("2025-01-13"),
          updatedAt: new Date("2025-01-13"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Works", null, {})
  },
}
