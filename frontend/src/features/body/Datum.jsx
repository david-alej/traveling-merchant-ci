import { useGetDatumQuery } from "../../util/query-util"
import { getColumns } from "../../util/body-util"
import ActionButton from "../../components/ActionButton"
import ApiResponse from "../../components/ApiResponse"
import Spinner from "../../components/Spinner"
import Delete from "./Delete"
import "./Datum.css"

import { Outlet } from "react-router-dom"
import { useParams, useLocation } from "react-router-dom"
import { useState } from "react"

export default function Datum() {
  const { id } = useParams()
  const route = useLocation().pathname.split("/")[1]
  const currentAction = useLocation().pathname.split("/")[3] || "view"
  const columns = getColumns(route)
  const [popUp, setPopUp] = useState()

  const { data, error, isFetching, isSuccess, isError } = useGetDatumQuery(
    route,
    id
  )

  let content

  if (isFetching) {
    content = <Spinner />
  } else if (isError) {
    content = (
      <div className="datum">
        <ApiResponse response={error} />
      </div>
    )
  } else if (isSuccess) {
    content = <Outlet context={[columns, data]} />
  }

  return (
    <>
      <div className="datum-headers">
        {["view", "edit", "delete"].map((action, index) => {
          const props = {
            className:
              "datum-header" + (action === currentAction ? " active" : ""),
            type: action,
            route: route,
            id: parseInt(id),
            text: action[0].toUpperCase() + action.slice(1),
            isTrashIcon: action === "delete",
          }

          if (action === "delete") {
            props.onClick = () => {
              setPopUp(
                <Delete
                  columns={columns}
                  data={data}
                  closePopUp={() => setPopUp(undefined)}
                />
              )
            }
          }

          return <ActionButton key={index} {...props} />
        })}
      </div>
      {content}
      {popUp}
    </>
  )
}
