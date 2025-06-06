import {
  formatSimpleDate,
  formatPhoneNumber,
  formatTagsColumn,
  formatFullDate,
} from "./formatters"
import routesColumnDefinitions from "./routesColumnDefinitions"

import { Link } from "react-router-dom"

export const reformColumn = (column, shallow) => {
  const {
    accessorKey: id,
    meta: { dataType, property },
  } = column

  column.cell = (props) => props.getValue()

  switch (dataType) {
    case "arr": {
      column.filterFn = "arrayLengthFilter"
      column.cell = (props) => props.getValue().length

      break
    }
    case "obj": {
      column.filterFn = "objectNameFilter"
      column.cell = (props) => {
        const value = props.getValue()

        if (!value) return <p>0</p>
        const { id: objId, [property]: name } = value

        return <Link to={`/${id}s/${objId}`}>{name}</Link>
      }

      break
    }

    case "type": {
      column.filterFn = "typeFilter"

      break
    }

    case "date": {
      column.sortingFn = "dateSorting"
      column.filterFn = "dateFilter"
      column.cell = shallow
        ? (props) => formatSimpleDate(props.getValue())
        : (props) => formatFullDate(props.getValue())

      break
    }

    case "str": {
      column.cell = (props) => {
        const propValue = props.getValue()
        const maxLength = shallow && 45

        if (id === "phoneNumber") return formatPhoneNumber(propValue)

        if (!propValue) return propValue

        return maxLength && propValue.length > maxLength
          ? props.getValue().slice(0, maxLength - 5) + "..."
          : props.getValue()
      }

      break
    }

    case "itr": {
      column.cell = (props) => formatTagsColumn(props.getValue(), shallow)
      column.enableSorting = false
      column.filterFn = "tagsFilter"

      break
    }

    case "num": {
      column.cell = (props) => `$${props.getValue()}`
      column.filterFn = "rangeFilter"

      break
    }

    case "int": {
      column.filterFn = "rangeFilter"
      if (column.accessorKey.toLowerCase().includes("id")) {
        const route = column.accessorKey.slice(0, -2) + "s"

        column.cell = (props) => {
          const id = props.getValue()

          return id ? <Link to={`/${route}/${id}`}>{id}</Link> : id
        }
      }
    }
  }
}

export const isReformed = (columns) => (columns.at(-1).cell ? true : false)

export const reformColumns = (columns, shallow = true) => {
  columns.forEach((column) => reformColumn(column, shallow))

  let newColumns = columns

  if (newColumns[0].accessorKey !== "id") {
    newColumns = [
      {
        accessorKey: "id",
        header: "Id",
        meta: { dataType: "int" },
        cell: (props) => props.getValue(),
      },
    ].concat(columns)
  }

  if (
    newColumns[1].accessorKey === "ticket" &&
    newColumns[2].accessorKey === "order"
  ) {
    newColumns[1].filterFn = "rangeFilter"
    newColumns[2].filterFn = "rangeFilter"
  }

  return newColumns
}

export const getPartialColumns = (route) => {
  const columns = routesColumnDefinitions[route]

  return reformColumns(columns)
}
