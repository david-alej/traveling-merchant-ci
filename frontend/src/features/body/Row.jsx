import { addRequirement } from "./bodySlice"

import PropTypes from "prop-types"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Row({ property, value, header, input }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (value === "Required") {
      dispatch(addRequirement(property))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, value])

  return (
    <div className="row">
      <div className="header">
        <div className="header-text">{header}</div>
      </div>
      <div className="value">{value}</div>
      {input}
    </div>
  )
}

Row.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.any,
  header: PropTypes.string.isRequired,
  input: PropTypes.object,
}
