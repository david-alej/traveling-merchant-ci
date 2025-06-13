"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Wares",
      [
        {
          name: "Loewe 001 Woman Perfume",
          type: "perfume",
          tags: ["women", "1-pc"],
          unitPrice: 155,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "DIOR 3-Pc. J'dore Eau de Parfum Gift Set",
          type: "perfume",
          tags: ["women", "3-pc"],
          unitPrice: 178,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "The Leather Medium Tote Bag",
          type: "bag",
          tags: ["women"],
          unitPrice: 450,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "Versace Men's 4-Pc. Eros Eau de Toilette Gift Set",
          type: "perfume",
          tags: ["men", "4-pc"],
          unitPrice: 176,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          name: "Eymi Unisex Leather Braclet with Infinity Sign Symbolic Love Fashion Braided Wristband Bangle",
          type: "braclet",
          tags: ["unisex"],
          unitPrice: 14,
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Wares", null, {})
  },
}
