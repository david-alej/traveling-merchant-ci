import Header from "./Header.jsx"
import Sidebar from "./SideBar.jsx"
import Logo from "./Logo.jsx"

import { useNavigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

export default function Root() {
  const navigate = useNavigate()
  const merchantName = useSelector((state) => state.session.merchantName)

  useEffect(() => {
    if (merchantName.length === 0) {
      navigate("/login")
    }
  }, [merchantName, navigate])

  return (
    <>
      {merchantName && (
        <>
          <Logo />
          <Sidebar />
        </>
      )}
      <Header />
      <main className={merchantName ? "accessed" : "initialized"}>
        <Outlet />
      </main>
    </>
  )
}
