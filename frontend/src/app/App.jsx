import Login from "../features/session/Login"
import Dashboard from "../components/dashboard/Dashboard"
import Root from "../components/root/Root"
import ParentRoute from "../components/ParentRoute"
import Datum from "../features/body/Datum"
import View from "../features/body/View"
import Edit from "../features/body/Edit"
import Create from "../features/body/Create"
import Search from "../features/body/Search"
import "./App.css"

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path=":route" element={<ParentRoute />}>
        <Route index path="" element={<Search />} />
        <Route path="create" element={<Create />} />
        <Route path=":id" element={<Datum />}>
          <Route index path="" element={<View />} />
          <Route path="edit" element={<Edit />} />
        </Route>
      </Route>
    </Route>
  )
)

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
