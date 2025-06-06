import { changeValue } from "../filtersSlice"
import Button from "../../../components/Button"
import "./SearchFilter.css"

import PropTypes from "prop-types"
import { LiaSearchSolid } from "react-icons/lia"
import { MdOutlineClear } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"

export default function SearchFilter({ header, filter: { id, value } }) {
  const dispatch = useDispatch()
  const route = useLocation().pathname.split("/")[1]

  const onFilterChange = (e) =>
    dispatch(changeValue({ route, id, value: e.target.value }))

  const onSearchClearHandler = () =>
    dispatch(changeValue({ route, id, value: "" }))

  return (
    <div className="search-filter-container">
      <div className="search-box">
        {value?.length > 0 ? (
          <Button
            className="search-filter-clear-button"
            type="button"
            icon={<MdOutlineClear />}
            onClick={onSearchClearHandler}
          />
        ) : (
          <div className="search-filter-icon">
            <LiaSearchSolid />
          </div>
        )}
        <input
          className="search-filter"
          type="text"
          value={value}
          placeholder={`Search by ${header}`}
          onChange={onFilterChange}
        />
      </div>
    </div>
  )
}

SearchFilter.propTypes = {
  header: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
}
