import Button from "./Button"

import { FaEye } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { FaDeleteLeft } from "react-icons/fa6"
import { MdDeleteForever } from "react-icons/md"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"

const actions = [
  { type: "view", icon: <FaEye size={23} />, endpoint: "" },
  { type: "edit", icon: <FaEdit size={23} />, endpoint: "/edit" },
  { type: "delete", icon: <FaDeleteLeft size={23} />, endpoint: "/delete" },
]

export default function ActionButton({
  id,
  className,
  type,
  route,
  text,
  isTrashIcon = false,
  onClick,
}) {
  const navigate = useNavigate()

  const { icon, endpoint } = actions.find((action) => action.type === type)
  const props = {
    className:
      `${type}-button` + " action-button" + (className ? " " + className : ""),
    icon,
    onClick: onClick || (() => navigate(`/${route}/${id}` + endpoint)),
  }

  if (text) props.text = text
  if (type === "delete" && isTrashIcon) {
    props.icon = <MdDeleteForever size={23} />
  }

  return <Button {...props} />
}

ActionButton.propTypes = {
  id: PropTypes.number,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  route: PropTypes.string,
  text: PropTypes.string,
  isTrashIcon: PropTypes.bool,
  onClick: PropTypes.func,
}
