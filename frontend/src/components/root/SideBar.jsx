import { SidebarData } from "./SidebarData"
import "./SideBar.css"

import { NavLink } from "react-router-dom"
import { IconContext } from "react-icons"

export default function Sidebar() {
  return (
    <div className="sidebar">
      <IconContext.Provider value={{ color: "undefined" }}>
        <nav className="nav-menu">
          <ul className="nav-menu-items">
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <NavLink to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </div>
  )
}
