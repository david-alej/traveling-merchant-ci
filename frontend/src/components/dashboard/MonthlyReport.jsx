import BarChart from "./BarChart"

import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const getWeeks = ({ year, month }) => {
  const firstOfMonth = new Date(year, month),
    lastOfMonth = new Date(year, month + 1, 0),
    lastDay = lastOfMonth.getDate()

  let currentDay = 6 - firstOfMonth.getDay() + 1
  const monthWeeks = [[1, currentDay]]
  currentDay++

  while (currentDay < lastDay + 1) {
    const newDay = currentDay + 6 <= lastDay ? currentDay + 6 : lastDay

    monthWeeks.push([currentDay, newDay])

    currentDay = newDay + 1
  }

  return monthWeeks
}

const getZerosWeek = () => Array.from({ length: 5 }, () => 0)

export default function MonthlyReport({ year, month, tickets, transactions }) {
  const [weeks, setWeeks] = useState([])
  const [reportValues, setReportValues] = useState({
    sales: getZerosWeek(),
    payments: getZerosWeek(),
    ordersLoss: getZerosWeek(),
    cashAppLoss: getZerosWeek(),
    revenue: getZerosWeek(),
  })

  const title = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "US/Central",
    formatMatcher: "basic",
  }).format(new Date(year, month))

  useEffect(() => {
    setWeeks(getWeeks({ year, month }))
  }, [year, month])

  useEffect(() => {
    const sales = getZerosWeek()

    if (tickets?.length) {
      for (const { cost, createdAt } of tickets) {
        const dayIdx = new Date(createdAt).getDate()
        const weekIdx = weeks.findIndex(
          ([firstOfWeek, lastOfWeek]) =>
            firstOfWeek <= dayIdx && dayIdx <= lastOfWeek
        )

        sales[weekIdx] += cost
      }
    }

    setReportValues((prev) => ({ ...prev, sales }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets])

  useEffect(() => {
    let [payments, ordersLoss, cashAppLoss, revenue] = Array.from(
      { length: 4 },
      () => getZerosWeek()
    )

    if (transactions?.length) {
      for (const {
        ticketId,
        orderId,
        payment,
        paymentType,
        paidAt,
      } of transactions) {
        const dayIdx = new Date(paidAt).getDate()
        const weekIdx = weeks.findIndex(
          ([firstOfWeek, lastOfWeek]) =>
            firstOfWeek <= dayIdx && dayIdx <= lastOfWeek
        )

        if (ticketId) {
          payments[weekIdx] += payment
          revenue[weekIdx] += payment

          if (paymentType === "cash app" && payment > 0) {
            cashAppLoss[weekIdx] += payment * 0.0275
            revenue[weekIdx] -= payment * 0.0275
          }
        } else if (orderId) {
          ordersLoss[weekIdx] += payment
          revenue[weekIdx] -= payment
        }
      }

      for (let weekIdx = 0; weekIdx < weeks.length; weekIdx++) {
        payments[weekIdx] = Math.round(payments[weekIdx] * 100) / 100
        cashAppLoss[weekIdx] = Math.round(cashAppLoss[weekIdx] * 100) / 100
        ordersLoss[weekIdx] = Math.round(ordersLoss[weekIdx] * 100) / 100
        revenue[weekIdx] = Math.round(revenue[weekIdx] * 100) / 100
      }
    }

    setReportValues((prev) => ({
      ...prev,
      payments,
      cashAppLoss,
      ordersLoss,
      revenue,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return (
    <BarChart
      id="monthly-report"
      title={title}
      labels={weeks.map(
        ([firstOfWeek, lastOfWeek]) => `${firstOfWeek}-${lastOfWeek}`
      )}
      {...reportValues}
    />
  )
}

MonthlyReport.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  tickets: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired,
}
