import Arrow from "./Arrow"
import "./DropDown.css"

import PropTypes from "prop-types"
import { useState } from "react"
import { MdOutlineClear } from "react-icons/md"

export default function DropDown({
  value,
  options,
  onMakeValue,
  onClearValue,
}) {
  const [selectIsOpened, setSelectIsOpened] = useState(false)

  return (
    <div className="select-container">
      <div className="custom-select single">
        <div className="select-box">
          {value?.length > 0 && (
            <div className="select-filter-clear-icon" onClick={onClearValue}>
              <MdOutlineClear />
            </div>
          )}
          <span className="selected-option">{value}</span>
          <Arrow
            state={selectIsOpened}
            onClick={() => setSelectIsOpened(!selectIsOpened)}
          />
        </div>
        <div className={"options" + (selectIsOpened ? " open" : "")}>
          {options.map((option) => (
            <div
              className={"option" + (value === option ? " active" : "")}
              value={option}
              key={option}
              onClick={onMakeValue(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DropDown.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onMakeValue: PropTypes.func.isRequired,
  onClearValue: PropTypes.func.isRequired,
}
