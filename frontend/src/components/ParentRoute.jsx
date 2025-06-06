import Button from "./Button"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { reset } from "../features/body/bodySlice"
import { FaSearch } from "react-icons/fa"
import { FaCirclePlus } from "react-icons/fa6"

function ParentRoute() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const path = useLocation().pathname.split("/")
  const route = path[1]
  const routeType = path[2] || ""

  useEffect(() => {
    dispatch(reset())
  }, [dispatch, route, routeType])

  return (
    <>
      <div key={route} className="parent-headers">
        {[
          { type: "", icon: <FaSearch /> },
          { type: "create", icon: <FaCirclePlus size={23} /> },
        ].map(({ type, icon }, index) => (
          <Button
            key={index}
            className={"parent-header" + (type === routeType ? " active" : "")}
            type="button"
            text={
              type ? (
                <strong>{type[0].toUpperCase() + type.slice(1)}</strong>
              ) : (
                <strong>View</strong>
              )
            }
            icon={icon}
            onClick={() => navigate(`/${route}/` + type)}
          />
        ))}
      </div>
      <Outlet />
    </>
  )
}

export default ParentRoute
