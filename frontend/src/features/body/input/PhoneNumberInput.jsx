import { formatPhoneNumber } from "../../../util/formatters"
import {
  changeError,
  changeValue,
  selectBodyProperty,
  selectErrorProperty,
} from "../bodySlice"
import ErrorBox from "../../../components/ErrorBox"

import PropTypes from "prop-types"
import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

const formatValue = (value) => {
  if (!value) return ""

  value = value.replace(/[^0-9]/g, "")
  const len = value.length

  let phoneNumber

  if (len) {
    phoneNumber = `(${value.slice(0, 3)})`
  }

  if (len > 3) {
    phoneNumber += `${value.slice(3, 6)}`
  }

  if (len > 6) {
    phoneNumber += `-${value.slice(6, 10)}`
  }

  return phoneNumber || ""
}

export default function PhoneNumberInput({ value }) {
  const dispatch = useDispatch()
  const phoneNumber = useSelector(selectBodyProperty("phoneNumber"))
  const error = useSelector(selectErrorProperty("phoneNumber"))
  const ref = useRef(null)

  const handleChange = ({ target }) => {
    const { value: newValue, selectionStart, selectionEnd } = target
    const digits = newValue.replace(/[^0-9]/g, "")
    const formattedNumber = formatValue(digits)
    let newError = false

    if (digits && digits.length < 10) {
      newError = "Please complete phone number."
    } else if (digits === value) {
      newError = "Please choose a different phone number than the current one."
    }

    dispatch(changeValue({ property: "phoneNumber", value: digits }))
    dispatch(
      changeError({
        property: "phoneNumber",
        error: newError,
      })
    )

    setTimeout(() => {
      if (ref.current) {
        const position =
          formattedNumber.indexOf(
            newValue[selectionStart - 1],
            selectionEnd - 1
          ) + 1 || selectionEnd
        ref.current.setSelectionRange(position, position)
      }
    }, 0)
  }

  return (
    <>
      <input
        className="phone-number"
        ref={ref}
        type="tel"
        name="phone"
        placeholder={(value && formatPhoneNumber(value)) || "(123)456-7890"}
        value={formatValue(phoneNumber)}
        onChange={handleChange}
        maxLength="14"
      ></input>
      <ErrorBox className="phone-number" exists={error}>
        {error}
      </ErrorBox>
    </>
  )
}

PhoneNumberInput.propTypes = {
  value: PropTypes.any,
}
