import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { MdWork } from "react-icons/md"

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Tickets",
    path: "/tickets",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <FaMoneyBillTransfer size={28} />,
    cName: "nav-text",
  },
  {
    title: "Clients",
    path: "/clients",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Works",
    path: "/works",
    icon: <MdWork />,
    cName: "nav-text",
  },
  {
    title: "Wares",
    path: "/wares",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
  {
    title: "Orders",
    path: "/orders",
    icon: <FaIcons.FaClipboardList />,
    cName: "nav-text",
  },
  {
    title: "Providers",
    path: "/providers",
    icon: <FaIcons.FaStore />,
    cName: "nav-text",
  },
]
