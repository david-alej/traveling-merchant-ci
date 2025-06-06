import PropTypes from "prop-types"

export default function Button({
  className,
  text,
  icon,
  isActive,
  onClick,
  disabled,
  notActive,
  type,
}) {
  return (
    <button
      className={
        className +
        (isActive ? " active" : "") +
        (notActive ? " not-active" : "")
      }
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text && <p className="button-text">{text}</p>}
      {icon && <div className="button-icon">{icon}</div>}
    </button>
  )
}

Button.propTypes = {
  className: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.any,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  notActive: PropTypes.bool,
  type: PropTypes.string,
}
