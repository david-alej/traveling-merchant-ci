import PropTypes from "prop-types"
import { Bar } from "react-chartjs-2"
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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
)

export default function BarChart({
  id,
  title,
  labels,
  sales,
  payments,
  ordersLoss,
  cashAppLoss,
  revenue,
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(160, 32, 240, 0.6)",
        borderColor: "rgba(160, 32, 240, 1)",
        borderWidth: 1,
        data: sales,
        stack: 1,
      },
      {
        label: "Payments",
        backgroundColor: "rgba(0, 0, 255, 0.6)",
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 1,
        data: payments,
        stack: 2,
      },
      {
        label: "Orders",
        backgroundColor: "rgba(255, 0, 30, 0.6)",
        borderColor: "rgba(255, 0, 30, 1)",
        borderWidth: 1,
        data: ordersLoss,
        stack: 3,
      },
      {
        label: "Cash App fees",
        backgroundColor: "rgba(255, 30, 0, 0.6)",
        borderColor: "rgba(255, 30, 0, 1)",
        borderWidth: 1,
        data: cashAppLoss,
        stack: 3,
      },
      {
        label: "Revenue",
        backgroundColor: "rgba(0, 255, 0, 0.6)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 1,
        data: revenue,
        stack: 4,
      },
    ],
  }

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 32 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 16 } },
      },
      x: {
        ticks: { font: { size: 24 } },
      },
    },
  }

  return (
    <div id={id} className="bar-chart">
      <Bar data={data} options={options} />
    </div>
  )
}

BarChart.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  sales: PropTypes.array.isRequired,
  payments: PropTypes.array.isRequired,
  ordersLoss: PropTypes.array.isRequired,
  cashAppLoss: PropTypes.array.isRequired,
  revenue: PropTypes.array.isRequired,
}
