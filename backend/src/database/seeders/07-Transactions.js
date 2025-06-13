"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Transactions",
      [
        {
          orderId: 1,
          ticketId: null,
          paidAt: "2025-01-01T20:00:00.000Z",
          payment: 3413.65,
          paymentType: "visa",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: 2,
          ticketId: null,
          paidAt: "2025-01-01T20:00:00.000Z",
          payment: 959.59,
          paymentType: "visa",
          createdAt: new Date("2025-01-01"),
          updatedAt: new Date("2025-01-01"),
        },
        {
          orderId: null,
          ticketId: 1,
          payment: 150,
          paymentType: "cash app",
          paidAt: new Date("2025-01-09"),
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          orderId: null,
          ticketId: 2,
          payment: 200,
          paymentType: "visa",
          paidAt: new Date("2025-01-09"),
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          orderId: null,
          ticketId: 3,
          payment: 168.27,
          paymentType: "cash",
          paidAt: new Date("2025-01-13"),
          createdAt: new Date("2025-01-13"),
          updatedAt: new Date("2025-01-13"),
        },
        {
          orderId: null,
          ticketId: 1,
          payment: 86.9,
          paymentType: "visa",
          paidAt: new Date("2025-01-16"),
          createdAt: new Date("2025-01-16"),
          updatedAt: new Date("2025-01-16"),
        },
        {
          orderId: null,
          ticketId: 3,
          payment: -155,
          paymentType: "cash app",
          paidAt: new Date("2025-01-17"),
          createdAt: new Date("2025-01-17"),
          updatedAt: new Date("2025-01-17"),
        },
        {
          orderId: 1,
          ticketId: null,
          payment: -1450,
          paymentType: "visa",
          paidAt: new Date("2025-01-17"),
          createdAt: new Date("2025-01-17"),
          updatedAt: new Date("2025-01-17"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transactions", null, {})
  },
}
