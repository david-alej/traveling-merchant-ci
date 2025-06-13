"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Providers",
      [
        {
          name: "Amazon",
          address: "0000 online",
          phoneNumber: "1632474734",
          email: "derick_kertzmann@amazon.support.com",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          name: "Ebay",
          address: "0000 online",
          phoneNumber: "5125869601",
          email: "",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Providers", null, {})
  },
}
