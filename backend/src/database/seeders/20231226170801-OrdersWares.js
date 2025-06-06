"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "OrdersWares",
      [
        {
          orderId: 1,
          wareId: 1,
          unitPrice: 145,
          amount: 10,
          returned: 10,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: 1,
          wareId: 2,
          unitPrice: 160,
          amount: 5,
          returned: 0,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: 1,
          wareId: 3,
          unitPrice: 415,
          amount: 2,
          returned: 0,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: 2,
          wareId: 4,
          unitPrice: 150,
          amount: 5,
          returned: 0,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: 2,
          wareId: 5,
          unitPrice: 10,
          amount: 10,
          returned: 0,
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrdersWares", null, {})
  },
}
