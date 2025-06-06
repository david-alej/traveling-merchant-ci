import { selectBodyProperty } from "../bodySlice"
import { changeValue } from "../bodySlice"
import { getTodayIsoDate } from "../../../util/formatters"
import Button from "../../../components/Button"

import PropTypes from "prop-types"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

export default function DateInput({ value, property }) {
  const dispatch = useDispatch()
  const date = useSelector(selectBodyProperty(property))
  const [dateOn, setDateOn] = useState(false)

  useEffect(() => {
    if (dateOn && !date) {
      dispatch(
        changeValue({
          property,
          value: getTodayIsoDate(),
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateOn])

  const handleChange = (newValue) =>
    dispatch(
      changeValue({
        property,
        value: newValue.toJSON() === value ? undefined : newValue.toJSON(),
      })
    )

  const clearDate = () => dispatch(changeValue({ property, value: undefined }))

  return (
    <div className="input-switch">
      <Button
        type="button"
        className="input-switch-button"
        onClick={() => {
          clearDate()
          setDateOn(!dateOn)
        }}
        text={dateOn ? "Date On" : "Date Off"}
      />
      <DateTimePicker
        className="date"
        value={date ? dayjs(date) : dayjs(value)}
        onChange={handleChange}
        format="MMM DD YYYY hh:mm A"
        disabled={!dateOn}
      />
    </div>
  )
}

DateInput.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.any,
}
