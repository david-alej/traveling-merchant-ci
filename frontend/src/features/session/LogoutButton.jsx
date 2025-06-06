import { rootSplitApi } from "../../api/apiSlice.js"
import Spinner from "../../components/Spinner.jsx"
import Button from "../../components/Button.jsx"
import { clearSession } from "./sessionSlice.js"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdLogout } from "react-icons/md"
import { useDispatch } from "react-redux"

export default function LogoutButton() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [failedLogout, setFailedLogout] = useState("")

  const [logout, { isLoading, isError }] = rootSplitApi.useLogoutMutation()

  const handleClick = async (e) => {
    e.preventDefault()

    const result = await logout()
    console.log(result)
    if (result.error) return setFailedLogout(result.error.data)

    dispatch(clearSession())
    navigate("/login")
  }

  let content

  if (isLoading) {
    content = <Spinner />
  } else if (isError) {
    content = failedLogout
  } else {
    content = <></>
  }

  return (
    <>
      {content}
      <Button
        className="primary"
        onClick={handleClick}
        text="Logout"
        icon={<MdLogout size={23} />}
      />
      {/* <form onSubmit={handleSubmit}>
        <button type="submit" className="primary">
          <p>Logout</p>
        </button>
      </form> */}
    </>
  )
}
