import { useEffect, useState } from "react"
import finances from "./DashboardData"

import PropTypes from "prop-types"

export default function DailyReport({ day, tickets, transactions }) {
  const [reportValues, setReportValues] = useState({
    sales: 0,
    payments: 0,
    ordersLoss: 0,
    cashAppLoss: 0,
    revenue: 0,
  })

  useEffect(() => {
    let sales = 0
    if (tickets?.length > 0) {
      for (const { cost, createdAt } of tickets) {
        const dayIdx = new Date(createdAt).getDate()

        if (dayIdx === day) sales += cost
      }
    }

    setReportValues((prev) => ({ ...prev, sales }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets])

  useEffect(() => {
    let [payments, ordersLoss, cashAppLoss, revenue] = Array.from(
      { length: 4 },
      () => 0
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

        if (dayIdx !== day) continue

        if (ticketId) {
          payments += payment
          revenue += payment

          if (paymentType === "cash app" && payment > 0) {
            cashAppLoss += payment * 0.0275
            revenue -= payment * 0.0275
          }
        } else if (orderId) {
          ordersLoss += payment
          revenue -= payment
        }
      }

      payments = Math.round(payments * 100) / 100
      cashAppLoss = Math.round(cashAppLoss * 100) / 100
      ordersLoss = Math.round(ordersLoss * 100) / 100
      revenue = Math.round(revenue * 100) / 100
    }

    setReportValues((prev) => ({
      ...prev,
      payments,
      ordersLoss,
      cashAppLoss,
      revenue,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return (
    <div className="finances">
      {finances.map(({ name, header, Icon }, index) => (
        <div key={index} className="finance">
          <h3 className="finance-name">{header}</h3>
          <div className="horizontal-break"></div>
          <div className="finance-values">
            <h2 className="finance-value number">
              $
              {name === "loss"
                ? reportValues.ordersLoss + reportValues.cashAppLoss
                : reportValues[name]}
            </h2>
            <Icon className="finance-value icon" size={26} />
          </div>
        </div>
      ))}
    </div>
  )
}

DailyReport.propTypes = {
  day: PropTypes.number.isRequired,
  tickets: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired,
}
