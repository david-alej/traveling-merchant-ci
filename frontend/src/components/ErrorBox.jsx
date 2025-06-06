import PropTypes from "prop-types"

// eslint-disable-next-line react/prop-types
export default function ErrorBox({ className = "", exists, children }) {
  return (
    <>
      {exists && (
        <div className={"error-box" + " " + className}>{children}</div>
      )}
    </>
  )
}

ErrorBox.propTypes = {
  className: PropTypes.string.isRequired,
  exists: PropTypes.any,
}
