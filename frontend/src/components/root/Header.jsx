import LogoutButton from "../../features/session/LogoutButton"
import Button from "../Button"
import "./Header.css"

import { useSelector } from "react-redux"
import { FaUser } from "react-icons/fa"

export default function Header() {
  const merchantName = useSelector((state) => state.session.merchantName)

  return (
    <>
      <header className={merchantName ? "accessed" : "initialized"}>
        {merchantName ? (
          <>
            <div id="left-header"></div>
            <div id="right-header">
              <Button
                className="merchant"
                text={merchantName}
                icon={<FaUser size={23} />}
                disabled={true}
                notActive={true}
              />
              <div className="vertical-line"></div>
              <LogoutButton />
            </div>
          </>
        ) : (
          <h1>Traveling Merchant</h1>
        )}
      </header>
    </>
  )
}
