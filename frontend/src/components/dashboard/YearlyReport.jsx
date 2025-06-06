import { useGetDataQuery } from "../../util/query-util"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import BarChart from "./BarChart"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
)

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

export default function YearlyReport({ year }) {
  const date = { year }

  const {
    data: tickets,
    isSuccess: ticketsIsSuccess,
    //  ...queryResults
  } = useGetDataQuery("tickets", {
    createdAt: date,
  })

  const [sales, setSales] = useState(Array.from({ length: 12 }, () => 0))

  useEffect(() => {
    if (ticketsIsSuccess) {
      setSales(() => Array.from({ length: 12 }, () => 0))

      for (let i = 0; i < tickets.length; i++) {
        const { cost, createdAt } = tickets[i]
        const monthIdx = new Date(createdAt).getMonth()

        setSales((prev) => {
          prev[monthIdx] += cost

          return prev
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets])

  const {
    data: transactions,
    isSuccess: transactionsIsSuccess,
    // ...transactionsQueryResults
  } = useGetDataQuery("transactions", {
    paidAt: date,
  })

  const [transactionsValues, setTransactionsValues] = useState({
    payments: Array.from({ length: 12 }, () => 0),
    cashAppLoss: Array.from({ length: 12 }, () => 0),
    ordersLoss: Array.from({ length: 12 }, () => 0),
    revenue: Array.from({ length: 12 }, () => 0),
  })

  useEffect(() => {
    if (transactionsIsSuccess) {
      setTransactionsValues(() => ({
        payments: Array.from({ length: 12 }, () => 0),
        cashAppLoss: Array.from({ length: 12 }, () => 0),
        ordersLoss: Array.from({ length: 12 }, () => 0),
        revenue: Array.from({ length: 12 }, () => 0),
      }))

      for (let i = 0; i < transactions.length; i++) {
        const { ticketId, orderId, payment, paymentType, paidAt } =
          transactions[i]
        const monthIdx = new Date(paidAt).getMonth()

        setTransactionsValues(
          ({ payments, cashAppLoss, ordersLoss, loss, revenue }) => {
            if (ticketId) {
              payments[monthIdx] += payment
              revenue[monthIdx] += payment
              if (paymentType === "cash app" && payment > 0) {
                cashAppLoss[monthIdx] +=
                  Math.round(payment * 0.0275 * 100) / 100
                revenue[monthIdx] -= Math.round(payment * 0.0275 * 100) / 100
              }
            } else if (orderId) {
              ordersLoss[monthIdx] += payment
              revenue[monthIdx] -= payment
            }

            // cashAppLoss[monthIdx] =
            //   Math.round(cashAppLoss[monthIdx] * 100) / 100

            return {
              payments,
              cashAppLoss,
              ordersLoss,
              loss,
              revenue,
            }
          }
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return (
    <BarChart
      id="yearly-report"
      labels={months}
      sales={sales}
      {...transactionsValues}
    />
  )

  // const data = {
  //   labels: months,
  //   datasets: [
  //     {
  //       label: "Sales",
  //       backgroundColor: "rgba(160, 32, 240, 0.6)",
  //       borderColor: "rgba(160, 32, 240, 1)",
  //       borderWidth: 1,
  //       data: sales,
  //       stack: 1,
  //     },
  //     {
  //       label: "Payments",
  //       backgroundColor: "rgba(0, 0, 255, 0.6)",
  //       borderColor: "rgba(0, 0, 255, 1)",
  //       borderWidth: 1,
  //       data: transactionsValues.payments,
  //       stack: 2,
  //     },
  //     {
  //       label: "Orders",
  //       backgroundColor: "rgba(255, 0, 30, 0.6)",
  //       borderColor: "rgba(255, 0, 30, 1)",
  //       borderWidth: 1,
  //       data: transactionsValues.ordersLoss,
  //       stack: 3,
  //     },
  //     {
  //       label: "Cash App fees",
  //       backgroundColor: "rgba(255, 30, 0, 0.6)",
  //       borderColor: "rgba(255, 30, 0, 1)",
  //       borderWidth: 1,
  //       data: transactionsValues.cashAppLoss,
  //       stack: 3,
  //     },
  //     {
  //       label: "Revenue",
  //       backgroundColor: "rgba(0, 255, 0, 0.6)",
  //       borderColor: "rgba(0, 255, 0, 1)",
  //       borderWidth: 1,
  //       data: transactionsValues.revenue,
  //       stack: 4,
  //     },
  //   ],
  // }

  // const options = {
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: { font: { size: 16 } },
  //     },
  //     x: {
  //       ticks: { font: { size: 24 } },
  //     },
  //   },
  // }

  // return (
  //   <div id="yearly-report">
  //     <Bar data={data} options={options} />
  //   </div>
  // )
}

YearlyReport.propTypes = {
  year: PropTypes.number.isRequired,
}
