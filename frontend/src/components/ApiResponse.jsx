import PropTypes from "prop-types"
import { LuSearchX } from "react-icons/lu"
import { FaTimesCircle, FaLock } from "react-icons/fa"
import { FaCircleCheck } from "react-icons/fa6"

const icons = {
  [200]: <FaCircleCheck />,
  [201]: <FaCircleCheck />,
  [400]: <FaTimesCircle />,
  [401]: <FaLock />,
  [404]: <LuSearchX />,
}

export default function ApiResponse({ response: { originalStatus, data } }) {
  return (
    <div className="api-error">
      {icons[originalStatus]}
      <div className="message">{data}</div>
    </div>
  )
}

ApiResponse.propTypes = {
  response: PropTypes.shape({
    originalStatus: PropTypes.number.isRequired,
    data: PropTypes.string.isRequired,
  }),
}
