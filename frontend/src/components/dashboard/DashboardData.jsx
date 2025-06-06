import { FaMoneyBill } from "react-icons/fa"
import { FaTag } from "react-icons/fa"
import { FaArrowAltCircleUp } from "react-icons/fa"
import { FaArrowAltCircleDown } from "react-icons/fa"

export default [
  { name: "sales", header: "Sales", Icon: FaTag },
  {
    name: "payments",
    header: "Payments",
    Icon: FaArrowAltCircleUp,
  },
  {
    name: "loss",
    header: "Loss",
    relation: "transactions",
    Icon: FaArrowAltCircleDown,
  },
  {
    name: "revenue",
    header: "Revenue",
    Icon: FaMoneyBill,
  },
]
