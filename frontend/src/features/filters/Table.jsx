import ActionButton from "../../components/ActionButton.jsx"
import Button from "../../components/Button.jsx"
import Filters from "./filters/Filters.jsx"
import Delete from "../body/Delete.jsx"
import TableCell from "./TableCell.jsx"
import "./Table.css"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaFilter } from "react-icons/fa6"
import PropTypes from "prop-types"

Table.propTypes = {
  route: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  setData: PropTypes.func,
  state: PropTypes.object,
  onPaginationChange: PropTypes.func,
  disabledDoubleClick: PropTypes.bool,
  onDoubleClick: PropTypes.any,
  hasFilters: PropTypes.bool,
  hasActions: PropTypes.bool,
  customAction: PropTypes.func,
  editableColumns: PropTypes.array,
}

export default function Table({
  route,
  columns,
  data,
  setData,
  state = {},
  onPaginationChange,
  onDoubleClick,
  hasFilters = false,
  hasActions = false,
  customAction,
  editableColumns,
}) {
  const navigate = useNavigate()
  const [filtersIsOpened, setFiltersIsOpened] = useState(false)
  const [popUp, setPopUp] = useState(<></>)

  if (editableColumns?.length) {
    for (const col of columns) {
      if (editableColumns.includes(col.accessorKey)) col.cell = TableCell
    }
  }

  const reactTableOptions = {
    data,
    columns,
    state,
    sortingFns: {
      dateSorting: (rowA, rowB, columnId) => {
        const dateA = rowA.getValue(columnId)
        const dateB = rowB.getValue(columnId)

        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0
      },
    },
    filterFns: {
      rangeFilter: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        const [min, max] = filterValue
        const minCondition =
          !min || typeof Number(min) !== "number" || min <= value
        const maxCondition =
          !max || typeof Number(max) !== "number" || max >= value
        return minCondition && maxCondition
      },
      typeFilter: (row, columnId, filterValue) => {
        const type = row.getValue(columnId)

        if (filterValue.length === 0) {
          return true
        } else {
          return type === filterValue
        }
      },
      tagsFilter: (row, columnId, filterValue) => {
        const tagArray = row.getValue(columnId)

        if (filterValue.length === 0) {
          return true
        } else {
          return filterValue.every((value) => tagArray.includes(value))
        }
      },
      dateFilter: (row, columnId, filterValue) => {
        const date = new Date(row.getValue(columnId))
        const minDateStr = filterValue[0]
        const maxDateStr = filterValue[1]

        if (filterValue.every((element) => element === "")) {
          return true
        } else {
          const minDate = new Date(minDateStr)
          const maxDate = new Date(maxDateStr)

          return filterValue.every((dateStr) => dateStr)
            ? minDate <= date && date <= maxDate
            : minDateStr
            ? minDate <= date
            : date <= maxDate
        }
      },
      arrayLengthFilter: (row, columnId, filterValue) => {
        const arrLen = row.getValue(columnId).length
        const [min, max] = filterValue

        if (!min && !max) {
          return true
        } else if (min && max) {
          return min <= arrLen && arrLen <= max
        } else {
          return min ? min <= arrLen : arrLen <= max
        }
      },
      objectNameFilter: (row, columnId, filterValue) => {
        const propertyName = Object.keys(row.getValue(columnId)).find((key) =>
          key.toLowerCase().includes("name")
        )
        const name = row.getValue(columnId)[propertyName]

        return filterValue ? name.toLowerCase().includes(filterValue) : true
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (element) => setData(element),
    },
  }

  if (onPaginationChange)
    reactTableOptions.onPaginationChange = onPaginationChange

  const table = useReactTable(reactTableOptions)

  onDoubleClick =
    onDoubleClick || ((row) => () => navigate(`/${route}/${row.original.id}`))

  return (
    <>
      {hasFilters && (
        <div className="table-headers">
          <div className="table-header">
            <Button
              className="title"
              type="button"
              text={<strong>Filter Search</strong>}
              icon={<FaFilter size={23} />}
              isActive={filtersIsOpened}
              onClick={() => setFiltersIsOpened(!filtersIsOpened)}
            />
            {filtersIsOpened && (
              <div className="filters-box">
                <Filters route={route} table={table} />
              </div>
            )}
          </div>
        </div>
      )}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {(hasActions || customAction
                ? headerGroup.headers.concat([
                    {
                      id: headerGroup.headers.length + 1,
                      column: {
                        columnDef: { header: "Actions" },
                        getCanSort: () => false,
                      },
                    },
                  ])
                : headerGroup.headers
              ).map((header) => (
                <th key={header.id}>
                  <div className="header-cell">
                    <div className="header-container">
                      <div className="header-text">
                        {header.column.columnDef.header}
                      </div>
                      {header.column.getCanSort() && (
                        <div
                          className="sorting-buttons"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <p
                            className="sorting-button"
                            style={{
                              color:
                                header.column.getIsSorted() === "asc" &&
                                "black",
                            }}
                          >
                            ▲
                          </p>
                          <p
                            className="sorting-button"
                            style={{
                              color:
                                header.column.getIsSorted() === "desc" &&
                                "black",
                            }}
                          >
                            ▼
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onDoubleClick={onDoubleClick(row)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {(hasActions || customAction) && (
                <td key={`${row.id}_actions`}>
                  <div className="actions">
                    {customAction && customAction(row)}
                    {hasActions && (
                      <>
                        <ActionButton
                          type="edit"
                          route={route}
                          id={row.original.id}
                        />
                        <ActionButton
                          type="delete"
                          onClick={() => {
                            setPopUp(
                              <Delete
                                columns={columns}
                                data={row.original}
                                closePopUp={() => setPopUp(undefined)}
                              />
                            )
                          }}
                        />
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="page-count">
        {`Page ${
          table.getState().pagination.pageIndex + 1
        } of ${table.getPageCount()} (${
          table.getFilteredRowModel().rows.length
        } results)`}
      </div>
      <div className="page-buttons">
        <Button
          className="page-button"
          type="button"
          text="<<"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <Button
          className="page-button"
          type="button"
          text="<"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <Button
          className="page-button"
          text=">"
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
        <Button
          className="page-button"
          text=">>"
          type="button"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
      {popUp}
    </>
  )
}
