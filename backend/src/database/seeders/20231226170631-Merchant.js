"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Merchants",
      [
        {
          username: "missioneros",
          password:
            "$2b$10$6q.TGL9YFo6rughcema0VOf2bQIcHBjwmG1A9QbSXSMuhaZ7CEQti", //nissiJire2
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Merchants", null, {})
  },
}
