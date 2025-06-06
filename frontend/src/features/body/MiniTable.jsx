import {
  removeElement,
  editObjectElement,
  selectBodyProperty,
  addRequirement,
} from "./bodySlice.js"
import { getMiniTableColumns, getNameValue } from "../../util/body-util.jsx"
import Table from "../filters/Table.jsx"
import ArrayInput from "./input/ArrayInput.jsx"
import Arrow from "../../components/Arrow.jsx"
import Button from "../../components/Button.jsx"

import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaDeleteLeft } from "react-icons/fa6"

function Value({ columns, route, value, canInput }) {
  const dispatch = useDispatch()
  const array = useSelector(selectBodyProperty(route))

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })
  const [arrayPagination, setArrayPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  })

  return (
    <div className="value">
      {Array.isArray(value) && value.length > 0 && (
        <>
          <strong>Value</strong>
          <Table
            route={route}
            columns={columns}
            data={value || []}
            state={{ pagination }}
            onPaginationChange={setPagination}
            onDoubleClick={
              !route.toLowerCase().includes("wares") ? false : () => {}
            }
          />
        </>
      )}
      {canInput && array && (
        <>
          <strong>Input</strong>
          <Table
            route={route}
            columns={columns}
            data={array}
            setData={(element) =>
              dispatch(editObjectElement({ property: route, element }))
            }
            onDoubleClick={() => {}}
            editableColumns={
              route === "ordersWares"
                ? ["unitPrice", "amount", "returned"]
                : ["amount", "returned"]
            }
            state={{ pagination: arrayPagination }}
            onPaginationChange={setArrayPagination}
            customAction={(row) => (
              <Button
                type="button"
                className="delete-element-button"
                icon={<FaDeleteLeft />}
                onClick={() =>
                  dispatch(
                    removeElement({
                      property: route,
                      element: { id: row.original.id },
                    })
                  )
                }
              />
            )}
          />
        </>
      )}
    </div>
  )
}

Value.propTypes = {
  columns: PropTypes.array.isRequired,
  route: PropTypes.string.isRequired,
  value: PropTypes.any,
  canInput: PropTypes.bool.isRequired,
}

export default function MiniTable({ property, value, header, canInput }) {
  const dispatch = useDispatch()
  const path = useLocation().pathname.split("/")
  const parentRoute = path[1]
  const excludedId = parentRoute.slice(0, -1) + "Id"

  const nameValue = getNameValue(value)
  const columns = getMiniTableColumns(property, header, excludedId)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (value === "Required") {
      dispatch(addRequirement(property))
    }
  })

  return (
    <div className="mini-table">
      <div className="header">
        <div className="header-text">{header}</div>
        <div className="name-value">
          <Arrow state={isOpen} onClick={() => setIsOpen(!isOpen)} />
          {typeof value === "object" ? nameValue : value}
        </div>
        {canInput && (
          <div className="input">
            <ArrayInput
              property={property}
              value={value}
              header={header}
              excludedId={excludedId}
            />
          </div>
        )}
      </div>
      {isOpen && (
        <Value
          route={property}
          value={value}
          columns={columns}
          canInput={canInput}
        />
      )}
    </div>
  )
}

MiniTable.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.any,
  header: PropTypes.string.isRequired,
  canInput: PropTypes.bool.isRequired,
}
