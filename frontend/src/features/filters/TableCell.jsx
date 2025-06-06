import { useEffect, useState } from "react"
import PropTypes from "prop-types"

export default function TableCell({ getValue, row, column, table }) {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    table.options.meta?.updateData({ ...row.original, [column.id]: value })
  }

  return (
    <input
      value={value}
      onChange={({ target }) => setValue(target.value.replace(/[^0-9]/g, ""))}
      onBlur={onBlur}
    />
  )
}

TableCell.propTypes = {
  getValue: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
}
