import { useGetDataQuery } from "../../util/query-util"
import MonthlyReport from "./MonthlyReport"
import DailyReport from "./DailyReport"
import OpenTickets from "./OpenTickets"
import OpenOrders from "./OpenOrders"
import BarChart from "./BarChart"
import "./Dashboard.css"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
]

const getZerosMonth = () => Array.from({ length: 12 }, () => 0)
const getMatrix = () => Array.from({ length: 12 }, () => [])

export default function Dashboard() {
  // eslint-disable-next-line no-unused-vars
  const [{ year, month, day }, setDate] = useState(
    (() => {
      const date = new Date()

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      }
    })()
  )
  const [yearlyData, setYearlyData] = useState({
    tickets: getMatrix(),
    transactions: getMatrix(),
  })
  const [yearlyValues, setYearlyValues] = useState({
    tickets: { sales: getZerosMonth() },
    transactions: {
      payments: getZerosMonth(),
      ordersLoss: getZerosMonth(),
      cashAppLoss: getZerosMonth(),
      revenue: getZerosMonth(),
    },
  })
  const {
    tickets: { sales },
    transactions: { payments, ordersLoss, cashAppLoss, revenue },
  } = yearlyValues

  const {
    data: tickets,
    isSuccess: ticketsIsSuccess,
    //  ...queryResults
  } = useGetDataQuery("tickets", {
    createdAt: { year },
  })

  useEffect(() => {
    const yearlyTickets = getMatrix()
    const sales = getZerosMonth()

    if (ticketsIsSuccess) {
      for (const ticket of tickets) {
        const { cost, createdAt } = ticket
        const createdAtDate = new Date(createdAt)
        const monthIdx = createdAtDate.getMonth()

        sales[monthIdx] += cost
        yearlyTickets[monthIdx].push(ticket)
      }
    }

    setYearlyValues((prev) => ({ ...prev, tickets: { sales } }))
    setYearlyData((prev) => ({ ...prev, tickets: yearlyTickets }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets])

  const {
    data: transactions,
    isSuccess: transactionsIsSuccess,
    // ...transactionsQueryResults
  } = useGetDataQuery("transactions", {
    paidAt: { year },
  })

  useEffect(() => {
    const yearlyTransactions = getMatrix()
    const [payments, ordersLoss, cashAppLoss, revenue] = Array.from(
      { length: 4 },
      () => getZerosMonth()
    )

    if (transactionsIsSuccess) {
      for (const transaction of transactions) {
        const { ticketId, orderId, payment, paymentType, paidAt } = transaction
        const paidAtDate = new Date(paidAt)
        const monthIdx = paidAtDate.getMonth()

        if (ticketId) {
          payments[monthIdx] += payment
          revenue[monthIdx] += payment

          if (paymentType === "cash app" && payment > 0) {
            cashAppLoss[monthIdx] += payment * 0.0275
            revenue[monthIdx] -= payment * 0.0275
          }
        } else if (orderId) {
          ordersLoss[monthIdx] += payment
          revenue[monthIdx] -= payment
        }

        yearlyTransactions[monthIdx].push(transaction)
      }

      for (let monthIdx = 0; monthIdx < months.length; monthIdx++) {
        payments[monthIdx] = Math.round(payments[monthIdx] * 100) / 100
        cashAppLoss[monthIdx] = Math.round(cashAppLoss[monthIdx] * 100) / 100
        ordersLoss[monthIdx] = Math.round(ordersLoss[monthIdx] * 100) / 100
        revenue[monthIdx] = Math.round(revenue[monthIdx] * 100) / 100
      }
    }

    setYearlyValues((prev) => ({
      ...prev,
      transactions: { payments, ordersLoss, cashAppLoss, revenue },
    }))
    setYearlyData((prev) => ({ ...prev, transactions: yearlyTransactions }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  const handleDateChange = (newValue) => {
    const newDate = new Date(newValue.toJSON())
    const year = newDate.getFullYear()
    const month = newDate.getMonth()
    const day = newDate.getDate()

    setDate({ year, month, day })
  }

  return (
    <div id="dashboard">
      <div className="header">
        <h1 className="header-text">Dashboard</h1>
        <DatePicker
          className="header-date"
          value={dayjs(new Date(year, month, day).toISOString())}
          onChange={handleDateChange}
          format="MMM DD YYYY"
        />
      </div>
      <DailyReport
        day={day}
        tickets={yearlyData.tickets[month]}
        transactions={yearlyData.transactions[month]}
      />
      <MonthlyReport
        year={year}
        month={month}
        tickets={yearlyData.tickets[month]}
        transactions={yearlyData.transactions[month]}
      />
      <BarChart
        id="yearly-report"
        title={`${year}`}
        labels={months}
        sales={sales}
        payments={payments}
        ordersLoss={ordersLoss}
        cashAppLoss={cashAppLoss}
        revenue={revenue}
      />
      <OpenTickets />
      <OpenOrders />
    </div>
  )
}
