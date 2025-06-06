import DropDown from "../../../components/DropDown"
import { changeValue } from "../filtersSlice"

import PropTypes from "prop-types"
import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"

export default function SelectFilter({ uniqueValues, filter: { id, value } }) {
  const dispatch = useDispatch()
  const route = useLocation().pathname.split("/")[1]

  const onMakeValue = (value) => () =>
    dispatch(changeValue({ route, id, value }))

  const onClearValue = () => dispatch(changeValue({ route, id, value: "" }))

  return (
    <DropDown
      value={value}
      options={uniqueValues}
      onMakeValue={onMakeValue}
      onClearValue={onClearValue}
    />
  )
}

SelectFilter.propTypes = {
  uniqueValues: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
}
