import { changeValue } from "./bodySlice"
import DropDown from "../../components/DropDown"

import { useState } from "react"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { DateTimePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"

const getTimes = (isoDate) => {
  const year = Number(isoDate.slice(0, 4))
  const month = Number(isoDate.slice(5, 7)) - 1
  const day = Number(isoDate.slice(8, 10))
  const hour = Number(isoDate.slice(11, 13))

  return [
    { name: "year", value: year },
    { name: "month", value: month },
    { name: "day", value: day },
    { name: "hour", value: hour },
  ]
}

const createDateObj = (date, upToTime) => {
  if (upToTime === "") return {}

  const times = getTimes(date)
  const dateObj = {}

  for (const { name, value } of times) {
    dateObj[name] = value

    if (name === upToTime) break
  }

  return dateObj
}

export default function SearchDate({ property, header }) {
  const dispatch = useDispatch()
  const [dateValue, setDateValue] = useState(new Date().toISOString())
  const [upToTime, setUpToTime] = useState("")

  const handleDateChange = (newValue) => {
    const isoDate = newValue.toJSON()

    setDateValue(isoDate)
    dispatch(changeValue({ property, value: createDateObj(isoDate, upToTime) }))
  }

  const changeDropDown = (option) => () => {
    dispatch(
      changeValue({
        property,
        value: createDateObj(dateValue, option),
      })
    )
    setUpToTime(option)
  }

  const clearDropDown = () => {
    dispatch(
      changeValue({
        property,
        value: undefined,
      })
    )
    setUpToTime("")
  }

  return (
    <div className="row">
      <div className="header">
        <div className="header-text">{header}</div>
      </div>
      <div className="value search-date">
        <div className="select-text">Time specificity:</div>
        <div className="select-value">
          <DropDown
            value={upToTime}
            options={["year", "month", "day", "hour"]}
            onMakeValue={changeDropDown}
            onClearValue={clearDropDown}
          />
        </div>
      </div>
      <div className="input">
        <DateTimePicker
          className="date"
          value={dayjs(dateValue)}
          onChange={handleDateChange}
          format="MMM DD YYYY hh:mm A"
          disabled={!upToTime}
        />
      </div>
    </div>
  )
}

SearchDate.propTypes = {
  property: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
}
