import {
  addRequirement,
  removeRequirement,
  selectBodyProperty,
  changeValue,
} from "./bodySlice.js"
import { getMiniDatumColumns, getNameValue } from "../../util/body-util.jsx"
import ObjectInput from "./input/ObjectInput.jsx"
import Arrow from "../../components/Arrow.jsx"
import Button from "../../components/Button.jsx"

import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

function DataValue({ value, foreign, columns }) {
  let createSubValues =
    typeof value === "object" && value !== null && foreign
      ? (property, cell) => (
          <>
            <div className="sub-value">
              {cell({ getValue: () => value[property] })}
            </div>
            <div className="sub-value">
              {cell({ getValue: () => foreign[property] })}
            </div>
          </>
        )
      : !foreign
      ? (property, cell) => (
          <>
            <div className="sub-value">
              {cell({ getValue: () => value[property] })}
            </div>
          </>
        )
      : (property, cell) => (
          <>
            <div className="sub-value"> </div>
            <div className="sub-value">
              {cell({ getValue: () => foreign[property] })}
            </div>
          </>
        )

  return (
    <div className="data-value">
      {columns.map(({ accessorKey: property, header, cell }, index) => (
        <div className="sub-row" key={index}>
          <div className="sub-header">{header}</div>
          {createSubValues(property, cell)}
        </div>
      ))}
    </div>
  )
}

DataValue.propTypes = {
  value: PropTypes.any,
  foreign: PropTypes.object,
  header: PropTypes.string.isRequired,
  columns: PropTypes.array,
}

export default function MiniDatum({
  property,
  value,
  header,
  canInput = false,
  isActive,
  setActivity,
}) {
  const dispatch = useDispatch()
  const columns = getMiniDatumColumns(property)
  const nameValue = typeof value === "object" ? getNameValue(value) : value
  const hasActivity = setActivity

  const foreign = useSelector(selectBodyProperty(property))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (value === "Required") {
      if (!setActivity || (setActivity && isActive)) {
        dispatch(addRequirement(property))
      } else {
        dispatch(removeRequirement(property))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, value, isActive])

  useEffect(() => {
    if (hasActivity && !isActive && foreign && Object.keys(foreign).length) {
      dispatch(changeValue({ property, value: undefined }))
    }
  }, [property, hasActivity, isActive, foreign, dispatch])

  return (
    <div
      className={"mini-datum" + (hasActivity && !isActive ? " not-active" : "")}
    >
      <div className="header">
        <div className="header-text">{header}</div>
        <div className="name-value">
          <Arrow state={isOpen} onClick={() => setIsOpen(!isOpen)} />
          <div className="object-name-value">{nameValue}</div>
          {hasActivity &&
            (isActive ? (
              <Button
                type="button"
                className="object-activity-button on"
                onClick={setActivity}
                text="On"
              />
            ) : (
              <Button
                type="button"
                className="object-activity-button"
                onClick={setActivity}
                text="Disabled"
              />
            ))}
        </div>
        {canInput && (!hasActivity || isActive) && (
          <div className="input">
            <ObjectInput property={property} value={value} header={header} />
          </div>
        )}
      </div>
      {isOpen && ((typeof value === "object" && value !== null) || foreign) && (
        <div className="value">
          <DataValue
            value={value}
            foreign={foreign}
            header={header}
            columns={columns}
          />
        </div>
      )}
    </div>
  )
}

MiniDatum.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.any,
  header: PropTypes.string.isRequired,
  canInput: PropTypes.bool,
  isActive: PropTypes.bool,
  setActivity: PropTypes.func,
}
