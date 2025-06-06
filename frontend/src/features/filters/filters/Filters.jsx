import { useSelector } from "react-redux"
import routesColumnDefinitions from "../../../util/routesColumnDefinitions"
import { selectRouteFilters } from "../filtersSlice"
import EqualitiesFilter from "./EqualitiesFilter"
import MultiSelectFilter from "./MultiSelectFilter"
import SearchFilter from "./SearchFilter"
import SelectFilter from "./SelectFilter"

import PropTypes from "prop-types"

export default function Filters({ route, table }) {
  const filters = useSelector(selectRouteFilters(route))
  const columns = routesColumnDefinitions[route]

  return (
    <div className="filters">
      {columns.map(({ accessorKey: id, header, meta: { dataType } }, index) => {
        const filter = filters[index]
        const props = { header, filter }
        const { value } = filter

        let content

        if (typeof value === "string" && dataType !== "type") {
          content = <SearchFilter {...props} />
        } else if (dataType === "type" || dataType === "itr") {
          const flattendArray = table
            .getCoreRowModel()
            .flatRows.flatMap((row) => row.getValue(id))

          const uniqueValues = Array.from(new Set(flattendArray))

          content =
            dataType === "type" ? (
              <SelectFilter uniqueValues={uniqueValues} {...props} />
            ) : (
              <MultiSelectFilter uniqueValues={uniqueValues} {...props} />
            )
        } else if (value.length === 2) {
          content = <EqualitiesFilter {...props} />
        }

        return (
          <div key={index} className="filter">
            <strong>{header + ": "}</strong>
            <div className="filter-break" />
            {content}
          </div>
        )
      })}
    </div>
  )
}

Filters.propTypes = {
  route: PropTypes.string.isRequired,
  table: PropTypes.object.isRequired,
}
