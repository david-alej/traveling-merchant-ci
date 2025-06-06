import {
  changeValue,
  changeError,
  selectBodyProperty,
  selectErrorProperty,
} from "../bodySlice"
import ErrorBox from "../../../components/ErrorBox"

import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"
import { validate } from "email-validator"
import { useDispatch, useSelector } from "react-redux"

export default function StringInput({ property, value }) {
  const dispatch = useDispatch()
  const string = useSelector(selectBodyProperty(property)) || ""
  const error = useSelector(selectErrorProperty(property))
  const [width, setWidth] = useState("25%")
  const span = useRef()

  value = value || "Text"

  useEffect(() => {
    if (
      span.current &&
      span.current.offsetWidth !== span.current.parentElement.offsetWidth
    ) {
      const parentWidth = span.current.parentElement.offsetWidth
      const minWidth = parentWidth / 2
      const newWidth = `${Math.min(
        Math.max(minWidth, span.current.offsetWidth + 2),
        parentWidth
      )}px`

      setWidth(newWidth)
    }
  }, [string])

  const handleChange = ({ target }) => {
    let { value: newValue } = target
    let newError = false

    if (property === "type") newValue = newValue.trim()

    if (newValue === value) {
      newError = "Please choose a different value from the current one."
    } else if (property === "email" && !validate(value)) {
      newError = "Email is not a valid."
    }

    dispatch(changeError({ property, error: newError }))
    dispatch(changeValue({ property, value: newValue }))
  }

  return (
    <>
      <textarea
        className="string"
        placeholder={value}
        value={string || ""}
        onChange={handleChange}
        style={{ width }}
      />
      <span id="hidden-span" ref={span}>
        {string.length > value.length ? string : value}
      </span>
      <ErrorBox className="string" exists={error}>
        {error}
      </ErrorBox>
    </>
  )
}

StringInput.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.string,
}
