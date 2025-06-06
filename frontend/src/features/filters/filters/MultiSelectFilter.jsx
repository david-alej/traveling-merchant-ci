import { addValue, removeValue } from "../filtersSlice"
import Arrow from "../../../components/Arrow"
import "./MultiSelectFilter.css"

import PropTypes from "prop-types"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"

export default function MultiSelectFilter({
  uniqueValues,
  filter: { id, value },
}) {
  const dispatch = useDispatch()
  const route = useLocation().pathname.split("/")[1]
  const [selectIsOpened, setSelectIsOpened] = useState(false)

  const onAddValue = (value) => () => dispatch(addValue({ route, id, value }))

  const onClearValue = (value) => () =>
    dispatch(removeValue({ route, id, value }))

  return (
    <div className="multi-select-container">
      <div className="custom-select">
        <div className="select-box">
          <div className="selected-options">
            {value.map((selectedOption) => (
              <span className="tag" key={selectedOption}>
                {selectedOption}
                <span
                  className="remove-tag"
                  onClick={onClearValue(selectedOption)}
                >
                  &times;
                </span>
              </span>
            ))}
          </div>
          <Arrow
            state={selectIsOpened}
            onClick={() => setSelectIsOpened(!selectIsOpened)}
          />
        </div>
        <div className={"options" + (selectIsOpened ? " open" : "")}>
          {uniqueValues.map((uniqueValue) => (
            <div
              className={
                "option" + (value.includes(uniqueValue) ? " active" : "")
              }
              value={uniqueValue}
              key={uniqueValue}
              onClick={onAddValue(uniqueValue)}
            >
              {uniqueValue}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

MultiSelectFilter.propTypes = {
  uniqueValues: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
}
