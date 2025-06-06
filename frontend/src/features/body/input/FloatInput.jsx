import { camelToFlat } from "../../../util/body-util"
import {
  changeError,
  changeValue,
  selectBodyProperty,
  selectErrorProperty,
} from "../bodySlice"
import ErrorBox from "../../../components/ErrorBox"

import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"

export default function FloatInput({ property, value, header, floatType }) {
  const dispatch = useDispatch()
  const float = useSelector(selectBodyProperty(property))
  const error = useSelector(selectErrorProperty(property))

  const handleChange = ({ target }) => {
    let { value: newValue } = target
    newValue = newValue.replace(/[^0-9.-]/g, "")
    let newError

    if (newValue !== 0 && !newValue) {
      newError = ""
    } else if (isNaN(newValue)) {
      newError = "a number"
    } else if (newValue === value) {
      newError = "different than the current number"
    } else if (floatType === "nonNegative" && newValue < 0) {
      newError = "positive or zero"
    } else if (floatType === "positive" && newValue <= 0) {
      newError = "positive"
    } else if (newValue?.split(".")[1]?.length > 2) {
      newError = "a number with only two decimal points"
    }

    dispatch(changeError({ property, error: newError }))
    dispatch(changeValue({ property, value: newValue }))
  }

  return (
    <>
      <input
        className={"float" + (error ? " error" : "")}
        placeholder={value || `${camelToFlat(floatType)} Number`}
        value={float || ""}
        onChange={handleChange}
      />
      <ErrorBox
        className="float"
        exists={error}
      >{`${header} field must be ${error}.`}</ErrorBox>
    </>
  )
}

FloatInput.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.number,
  header: PropTypes.string.isRequired,
  floatType: PropTypes.string,
}
