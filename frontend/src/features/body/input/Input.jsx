import PhoneNumberInput from "./PhoneNumberInput"
import DateInput from "./DateInput"
import StringInput from "./StringInput"
import TagsInput from "./TagsInput"
import FloatInput from "./FloatInput"
import "./Input.css"

import PropTypes from "prop-types"

const allStrColumns = ["description", "paymentPlan", "address"]
const allNumColumns = ["cost", "payment", "unitPrice", "tax", "shipment"]

export default function Input({ property, value, header }) {
  const lowerCase = property.toLowerCase()
  const props = { property, value, header }

  let content

  if (property.slice(-2) === "At") {
    content = <DateInput {...props} />
  } else if (property === "phoneNumber") {
    content = <PhoneNumberInput {...props} />
  } else if (property === "email") {
    content = <StringInput {...props} />
  } else if (property === "tags") {
    content = <TagsInput {...props} />
  } else if (allNumColumns.includes(property)) {
    content = (
      <FloatInput
        {...props}
        floatType={
          property === "unitPrice"
            ? "positive"
            : property === "payment"
            ? "all"
            : "nonNegative"
        }
      />
    )
  } else if (
    lowerCase.includes("name") ||
    lowerCase.includes("type") ||
    allStrColumns.includes(property)
  ) {
    content = <StringInput {...props} />
  }

  return <div className="input">{content}</div>
}

Input.propTypes = {
  property: PropTypes.string.isRequired,
  value: PropTypes.any,
  header: PropTypes.string.isRequired,
}
