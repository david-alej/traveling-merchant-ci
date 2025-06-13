"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Clients",
      [
        {
          fullname: "Defective",
          address: "0000 Street",
          workId: 1,
          phoneNumber: "0000000000",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          fullname: "James Moe",
          address: "1823 Steele Street",
          phoneNumber: "9566347775",
          workId: 1,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          fullname: "Kellen Paucek",
          address: "1454 Sussex Court",
          phoneNumber: "2543865553",
          workId: 2,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          fullname: "Madilyn Langosh",
          address: "1571 Weekly Street",
          phoneNumber: "2103424367",
          workId: 3,
          createdAt: new Date("2025-01-13"),
          updatedAt: new Date("2025-01-13"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Clients", null, {})
  },
}
