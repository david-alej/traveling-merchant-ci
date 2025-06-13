"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SeedMeta", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      key: Sequelize.STRING,
      value: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })

    await queryInterface.bulkInsert("SeedMeta", [
      {
        key: "seeded",
        value: "true",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SeedMeta")
  },
}
