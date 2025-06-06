import { FaAngleRight } from "react-icons/fa"
import PropTypes from "prop-types"

export default function Arrow({ state, onClick, disabled }) {
  return (
    <FaAngleRight
      size={20}
      className={"arrow" + (state ? " down" : "")}
      onClick={onClick}
      disabled={disabled}
    />
  )
}

Arrow.propTypes = {
  state: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}
