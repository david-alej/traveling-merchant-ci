import { reset, selectBody } from "./bodySlice"
import { selectRouteFilters } from "../filters/filtersSlice"
import { checkForErrors, formatBody } from "../../util/body-util"
import { useGetDataQuery } from "../../util/query-util"
import { getPartialColumns } from "../../util/filters-util"
import Spinner from "../../components/Spinner"
import Table from "../filters/Table"
import Button from "../../components/Button"
import ApiResponse from "../../components/ApiResponse"
import IntegerInput from "./input/IntegerInput"
import Input from "./input/Input"
import SearchDate from "./SearchDate"
import MiniDatum from "./MiniDatum"
import Row from "./Row"

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { MdFindInPage } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

export default function Search() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const route = useLocation().pathname.split("/")[1]
  const columns = getPartialColumns(route)

  // eslint-disable-next-line no-unused-vars
  const { errors, requirements, ...body } = useSelector(selectBody)
  const columnFilters = useSelector(selectRouteFilters(route))
  const [inputsOn, setInputsOn] = useState(false)
  const [idOn, setIdOn] = useState(false)
  const [active, setActive] = useState({
    ticket: true,
    order: false,
  })

  const formattedBody = formatBody(body)

  const {
    data = [],
    error,
    isFetching,
    isSuccess,
    isError,
  } = useGetDataQuery(route, formattedBody)

  let content

  if (isFetching) {
    content = <Spinner />
  } else if (isError) {
    content = <ApiResponse response={error} />
  } else if (isSuccess) {
    content = (
      <Table
        route={route}
        columns={columns}
        data={data}
        state={{ columnFilters }}
        hasFilters={true}
        hasActions={true}
      />
    )
  }

  useEffect(() => {
    dispatch(reset())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idOn])

  return (
    <div className="search">
      <div className="search-headers">
        <div className="search-header">
          <Button
            className={"search-inputs button" + (inputsOn ? " active" : "")}
            type="button"
            text={<strong>Inputs</strong>}
            icon={<MdFindInPage size={23} />}
            onClick={() => setInputsOn(!inputsOn)}
          />
          {inputsOn && (
            <form
              onSubmit={(e) => {
                e.preventDefault()

                if (formattedBody.id) {
                  navigate(`/${route}/${formattedBody.id}`)
                }
              }}
            >
              <br />
              <div className="search-buttons">
                <Button
                  className="search-button"
                  type="button"
                  text="Id"
                  isActive={idOn}
                  onClick={() => setIdOn(true)}
                />
                <Button
                  className="search-button"
                  type="button"
                  text="Body"
                  isActive={!idOn}
                  onClick={() => setIdOn(false)}
                />
              </div>
              <br />
              <br />
              <div className="search-inputs box">
                {idOn ? (
                  <Row
                    property="id"
                    header="Id"
                    input={
                      <div className="">
                        <IntegerInput property="id" />
                      </div>
                    }
                  />
                ) : (
                  columns.map(
                    (
                      {
                        accessorKey: property,
                        header,
                        meta: { isOriginal, isOptional, isForeign },
                      },
                      index
                    ) => {
                      const props = {
                        key: index,
                        property,
                        header,
                        canInput: true,
                      }

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

                        content = <MiniDatum {...props} />
                      } else if (property.slice(-2) === "At") {
                        content = <SearchDate {...props} />
                      } else if (isOriginal || isOptional) {
                        props.input = (
                          <Input property={property} header={header} />
                        )

                        content = <Row {...props} />
                      }

                      return content
                    }
                  )
                )}
              </div>
              {idOn && (
                <div className="submit-container">
                  <Button
                    type="submit"
                    className="submit-button"
                    text="Submit"
                    disabled={checkForErrors(body, errors)}
                  />
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      {content}
    </div>
  )
}
