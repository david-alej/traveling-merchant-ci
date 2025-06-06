import { isEditable } from "../../util/body-util.jsx"
import MiniTable from "./MiniTable.jsx"
import MiniDatum from "./MiniDatum.jsx"
import Row from "./Row.jsx"
import Input from "./input/Input.jsx"

import { useLocation, useOutletContext, useParams } from "react-router-dom"
import { useState } from "react"

export default function View() {
  const { id } = useParams()
  const path = useLocation().pathname.split("/")
  const route = path[1]
  const action =
    !isNaN(path.at(-1)) && !isNaN(parseFloat(path.at(-1)))
      ? "view"
      : path.at(-1)
  const actionIsEdit = action === "edit"
  const [columns, data] = useOutletContext()

  const [active, setActive] = useState({
    Ticket: data?.ticket ? true : false,
    Order: data?.order ? true : false,
  })

  return (
    <div
      key={`${route}-${id}`}
      className={"datum" + (action === "view" ? " view-only" : "")}
    >
      {columns.map((colDef, index) => {
        const {
          accessorKey: property,
          header,
          meta: { dataType },
          cell,
        } = colDef
        let value = data[property]
        const props = { key: index, property, value, header, cell }

        let row

        if (dataType === "arr") {
          row = (
            <MiniTable
              {...props}
              canInput={actionIsEdit && header.slice(0, 5) === "Wares"}
            />
          )
        } else if (dataType === "obj") {
          if (route === "transactions" && actionIsEdit) {
            props.isActive = active[header]
            props.setActivity = () => {
              const oppisiteHeader = header === "Ticket" ? "Order" : "Ticket"
              const newState = !active[header]

              setActive(() => ({
                [header]: newState,
                [oppisiteHeader]: !newState,
              }))
            }
          }

          row = <MiniDatum canInput={actionIsEdit} {...props} />
        } else {
          if (actionIsEdit && isEditable(route, property)) {
            props.input = <Input {...props} />
          }

          props.value = cell({ getValue: () => value })

          row = <Row {...props} />
        }

        return row
      })}
    </div>
  )
}
