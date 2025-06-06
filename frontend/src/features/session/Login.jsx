import { rootSplitApi } from "../../api/apiSlice.js"
import ErrorBox from "../../components/ErrorBox.jsx"
import Button from "../../components/Button.jsx"
import "./Login.css"

import { useDispatch } from "react-redux"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../components/Spinner.jsx"
import { successfulLogin } from "./sessionSlice.js"

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [username, setUsername] = useState("missioneros")
  const [password, setPassword] = useState("nissiJire2")
  const [failedLogin, setFailedLogin] = useState("")

  const [login, { isLoading, isError }] = rootSplitApi.useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const failedLoginMsg =
      "Invalid Login: either username and/or password are wrong and do not match any signed up merchant credentials."

    const usernameIsInvalid = username.includes(" ") || username.length < 4
    const passwordIsInvalid =
      password.includes(" ") ||
      password.length < 8 ||
      !/\d/g.test(password) ||
      !/[a-zA-Z]/g.test(password)

    if (usernameIsInvalid || passwordIsInvalid) {
      setFailedLogin(failedLoginMsg)
    } else {
      const result = await login({ username, password })

      if ("error" in result) {
        setFailedLogin(result.error.data)

        return
      }

      dispatch(
        successfulLogin({
          csrfToken: result.data.csrfToken,
          merchantName: username,
        })
      )

      navigate("/dashboard")
    }
  }

  const handleUsernameChange = ({ target }) => {
    const newUsername = target.value

    setUsername(newUsername)
  }

  const handlePasswordChange = ({ target }) => {
    const newPassword = target.value

    setPassword(newPassword)
  }

  let content

  if (isLoading) {
    content = <Spinner />
  } else if (isError) {
    content = (
      <ErrorBox className="login" exists={true}>
        {failedLogin}
      </ErrorBox>
    )
  } else {
    content = <></>
  }

  return (
    <section id="login-container">
      <div id="login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div id="login-inputs">
            {content}
            <div className="login-input username">
              <label>Username</label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                maxLength="20"
                required
              />
            </div>
            <div className="login-input password">
              <label>Password</label>
              <input
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                maxLength="20"
                required
              />
            </div>
          </div>
          <div id="login-submit">
            <Button
              type="submit"
              className="primary"
              text="Sign In"
              onClick={() => {}}
            />
          </div>
        </form>
      </div>
    </section>
  )
}
