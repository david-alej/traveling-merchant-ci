import { changeExtremaValue } from "../filtersSlice"
import "./EqualitiesFilter.css"

import PropTypes from "prop-types"
import { FaLessThanEqual } from "react-icons/fa"
import { MdOutlineClear } from "react-icons/md"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"

export default function EqualitiesFilter({ header, filter: { id, value } }) {
  const dispatch = useDispatch()
  const route = useLocation().pathname.split("/")[1]
  const isDateColumn = useMemo(() => id.slice(-2) === "At", [id])

  const onExtremaChange = (extremaType) => (e) => {
    const newValue = isDateColumn ? e.toJSON() : e.target.value

    dispatch(changeExtremaValue({ route, id, value: newValue, extremaType }))
  }

  const onExtremaClear = (extremaType) => () =>
    dispatch(changeExtremaValue({ route, id, value: "", extremaType }))

  return (
    <div className="equalities-container">
      <div className="custom-equality">
        {value[0] && (
          <div
            className="equalities-filter-clear-icon"
            onClick={onExtremaClear("min")}
          >
            <MdOutlineClear />
          </div>
        )}
        {isDateColumn ? (
          <DatePicker
            className="extrema"
            selected={value[0]}
            onChange={onExtremaChange("min")}
            dateFormat={"MMM dd YYYY"}
            placeholderText="Minimum"
          />
        ) : (
          <input
            className="extrema"
            type="text"
            value={value[0]}
            onChange={onExtremaChange("min")}
            placeholder={`Minimum`}
          />
        )}
        <div className="less-than-equal-icon">
          <FaLessThanEqual />
        </div>
        <div className="header-value">{header}</div>
        <div className="less-than-equal-icon">
          <FaLessThanEqual />
        </div>
        {value[1] && (
          <div
            className="equalities-filter-clear-icon"
            onClick={onExtremaClear("max")}
          >
            <MdOutlineClear />
          </div>
        )}
        {isDateColumn ? (
          <DatePicker
            className="extrema"
            selected={value[1]}
            onChange={onExtremaChange("max")}
            dateFormat={"MMM dd YYYY"}
            placeholderText="Maximum"
          />
        ) : (
          <input
            className="extrema"
            type="text"
            value={value[1]}
            onChange={onExtremaChange("max")}
            placeholder={`Maximum`}
          />
        )}
      </div>
    </div>
  )
}

EqualitiesFilter.propTypes = {
  header: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
}
