import { selectBody } from "./bodySlice"
import { checkCreateBody, formatBody } from "../../util/body-util"
import { useCreateDataMutation } from "../../util/query-util"
import routesColumnDefinitions from "../../util/routesColumnDefinitions"
import Button from "../../components/Button"
import Spinner from "../../components/Spinner"
import Input from "./input/Input"
import MiniTable from "./MiniTable"
import MiniDatum from "./MiniDatum"
import Row from "./Row"

import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useSelector } from "react-redux"
import ApiResponse from "../../components/ApiResponse"

export default function Create() {
  const route = useLocation().pathname.split("/")[1]
  const routeColDefs = routesColumnDefinitions[route]
  const fullBody = useSelector(selectBody)
  const [active, setActive] = useState({
    ticket: true,
    order: false,
  })

  const [createData, { error: response, isLoading: isCreating, isError }] =
    useCreateDataMutation(route)

  let content

  if (isCreating) {
    content = <Spinner />
  } else if (isError) {
    content = (
      <div className="create">
        <ApiResponse response={response} />
      </div>
    )
  } else {
    content = (
      <>
        <div className="create">
          {routeColDefs.map(
            (
              {
                accessorKey: property,
                header,
                meta: { isOriginal, isOptional, isForeign, isForeigns },
              },
              index
            ) => {
              const props = { key: index, property, header, value: "Required" }

              let content

              if (isForeign) {
                if (route === "transactions") {
                  props.isActive = active[property]
                  props.setActivity = () => {
                    const oppisiteHeader =
                      property === "ticket" ? "order" : "ticket"
                    const newState = !active[property]

                    setActive(() => ({
                      [property]: newState,
                      [oppisiteHeader]: !newState,
                    }))
                  }
                }

                content = <MiniDatum {...props} canInput={true} />
              } else if (isForeigns) {
                content = header.includes("Wares") ? (
                  <MiniTable {...props} canInput={true} />
                ) : (
                  content
                )
              } else if (isOriginal || isOptional) {
                props.input = <Input property={property} header={header} />
                if (isOptional) props.value = "Optional"

                content = <Row {...props} />
              }

              return content
            }
          )}
        </div>
        <div className="submit-container">
          <Button
            type="submit"
            className="submit-button"
            text="Submit"
            disabled={checkCreateBody(fullBody)}
          />
        </div>
      </>
    )
  }

  return (
    <form
      className="create"
      onSubmit={(e) => {
        e.preventDefault()
        // eslint-disable-next-line no-unused-vars
        const { errors, requirements, ...body } = fullBody
        const formattedBody = formatBody(body)

        try {
          createData(formattedBody)
        } catch (err) {
          console.log(err)
        }
      }}
    >
      {content}
    </form>
  )
}
