import ApiResponse from "./ApiResponse"
import Spinner from "./Spinner"

import PropTypes from "prop-types"

export default function QueryResults({ error, isFetching, isError }) {
  let content = <></>

  if (isFetching) {
    content = <Spinner />
  } else if (isError) {
    content = <ApiResponse response={error} />
  }

  return content
}

QueryResults.propTypes = {
  error: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
}
