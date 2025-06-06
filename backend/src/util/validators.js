/* eslint-disable quotes */
const { body, param } = require("express-validator")
const { Api400Error } = require("./apiErrors")
const { validationResult } = require("express-validator")

const sentenceCase = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, " $1")
  return result[0].toUpperCase() + result.substring(1).toLowerCase()
}

const basicCredentialValidator = (input, optional = false, isParam = false) => {
  const inputName = sentenceCase(input)
  let requestProperty = isParam ? param : body
  let head = requestProperty(input)

  if (!isParam) {
    if (optional) {
      head = head.optional({ nullable: true, checkFalsy: true })
    }

    head = head.notEmpty().withMessage(inputName + " must not be empty.")
  }

  return head.custom((value) => {
    if (value.includes(" ")) {
      throw new Error(inputName + " must no have any blank spaces.")
    }
    return true
  })
}

const usernameValidator = (
  input = "username",
  optional = false,
  isParam = false
) => {
  const inputName = sentenceCase(input)
  const head = basicCredentialValidator(input, optional, isParam)
  return head
    .isLength({ min: 4, max: 20 })
    .withMessage(
      inputName + " must be at least 4 characters and at most 20 characters."
    )
}

exports.usernameValidator = usernameValidator

const passwordValidator = (
  input = "password",
  optional = false,
  isParam = false
) => {
  const inputName = sentenceCase(input)
  const head = basicCredentialValidator(input, optional, isParam)

  return head
    .isLength({ min: 8, max: 20 })
    .withMessage(
      inputName + " must be at least 8 characters and at most 20 characters."
    )
    .matches("[0-9]")
    .withMessage(inputName + " must contain a number.")
    .matches("[A-Z]")
    .withMessage(inputName + " must contain an uppercase letter.")
    .matches("[a-z]")
    .withMessage(inputName + " must contain an uppercase letter.")
}

exports.passwordValidator = passwordValidator

const basicValidator = (input, optional = false, isParam = false) => {
  const inputName = sentenceCase(input)
  const requestProperty = isParam ? param : body
  let head = requestProperty(input)

  if (optional) {
    head = head.optional({ nullable: true, checkFalsy: true })
  }

  return { head, inputName }
}

exports.positiveIntegerValidator = (
  input,
  optional = false,
  isParam = false
) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isInt()
    .withMessage(inputName + " must be an integer number.")
    .custom((int) => {
      let errorMsg = " must be greater than zero."

      if (int <= 0) {
        throw new Error(inputName + errorMsg)
      }

      return true
    })
    .toInt()
}

exports.nonNegativeIntegerValidator = (
  input,
  optional = false,
  isParam = false
) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isInt()
    .withMessage(inputName + " must be an integer number.")
    .custom((int) => {
      let errorMsg = " must be greater than or equal to zero."

      if (int < 0) {
        throw new Error(inputName + errorMsg)
      }

      return true
    })
    .toInt()
}

exports.positiveFloatValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isFloat()
    .withMessage(inputName + " must be an float number.")
    .custom((float) => {
      if (float <= 0) {
        throw new Error(inputName + " must be greater than zero.")
      }

      return true
    })
    .toFloat()
}

exports.nonNegativeFloatValidator = (
  input,
  optional = false,
  isParam = false
) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isFloat()
    .withMessage(inputName + " must be an float number.")
    .custom((float) => {
      if (float < 0) {
        throw new Error(inputName + " must be greater than or equal to zero.")
      }

      return true
    })
    .toFloat()
}

exports.floatValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isFloat()
    .withMessage(inputName + " must be an float number.")
    .toFloat()
}

exports.wordValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isString()
    .withMessage(inputName + " must be a string.")
    .custom((str) => {
      if (!str.replaceAll(/\s/g, "")) {
        throw new Error(inputName + " must not be empty.")
      }

      const hasCharacter = /[a-zA-Z]/.test(str)

      if (!hasCharacter) {
        throw new Error(inputName + " must include at least one character.")
      }

      return true
    })
}

exports.stringValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isString()
    .withMessage(inputName + " must be a string.")
    .custom((str) => {
      if (!str.replaceAll(/\s/g, "")) {
        throw new Error(inputName + " must not be empty.")
      }

      return true
    })
}

exports.booleanValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isBoolean()
    .withMessage(inputName + " must be either true or false.")
}

exports.incrementValidator = (input) => {
  const { head } = basicValidator(input, false, false)

  return head.custom((voteValue) => {
    if (voteValue === 1 || voteValue === -1) return true

    throw new Error(
      `the voteValue in the request body object must either be -1 or 1.`
    )
  })
}

exports.arrayTextValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isArray({ max: 10, min: 1 })
    .withMessage(
      inputName +
        " array must have at least one element and less than 11 elements."
    )
    .custom((array) => {
      const arrayHasAllStringElements = array.every(
        (element) => typeof element === "string"
      )

      if (!arrayHasAllStringElements) {
        throw new Error(
          ` the given ${inputName} = ${array} is not an array that is made of all string elements.`
        )
      }

      return true
    })
}

exports.arrayObjectValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .isArray({ max: 50, min: 1 })
    .withMessage(
      inputName +
        " array must have at least one element and less than 50 elements."
    )
    .custom((array) => {
      const arrayHasAllObjectElements = array.every((element) => {
        return (
          typeof element === "object" &&
          !Array.isArray(element) &&
          element !== null
        )
      })

      if (!arrayHasAllObjectElements) {
        throw new Error(
          ` the given ${inputName} = ${array} is not an array that is made of all object elements.`
        )
      }

      return true
    })
}

exports.dateValidator = (input, optional = false, isParam = false) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head.custom((date) => {
    if (!isNaN(new Date(date))) return true

    throw new Error(`the given ${inputName} = ${date} is not a date.`)
  })
}

exports.searchDateValidator = (input) => {
  const [optional, isParam] = [true, false]
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head.custom((date) => {
    if (Array.isArray(date)) {
      if (date.length !== 2) {
        throw new Error(
          `the given ${inputName} date array = ${date} does not have two dates.`
        )
      }

      date.forEach((el, idx) => {
        const prefix = idx === 0 ? "minimum" : "maximum"
        if (isNaN(new Date(el))) {
          throw new Error(
            `the given ${prefix} ${inputName} = ${el} is not a date.`
          )
        }
      })
    } else if (typeof date === "object" && date !== null) {
      const { year, month, day, hour } = date
      const times = [year, month, day, hour]

      for (let i = 0; i < times.length - 1; i++) {
        const value = times[parseInt(i)]
        const nextValue = times[i + 1]

        const valueCondition =
          Number.isInteger(value) &&
          (i === 0
            ? String(value).length === 4
            : String(value).length === 2 || String(value).length === 1)

        const nextValueCondition =
          Number.isInteger(nextValue) &&
          (String(value).length === 2 || String(value).length === 1)

        if (i === 0 && !valueCondition) {
          throw new Error(
            `the given ${inputName} object = ${date} has to have at least a year property.`
          )
        }

        if (!valueCondition && nextValueCondition) {
          throw new Error(
            `the given ${inputName} object = ${date} must have values from bigger time measures to be exist for smaller time measure to be input, the time measures are from year, month, day, to hour.`
          )
        }
      }
    } else if (typeof date === "string") {
      if (isNaN(new Date(date))) {
        throw new Error(`the given ${inputName} = ${date} is not a date.`)
      }
    } else {
      throw new Error(
        `the given ${inputName} = ${date} is not an acceptables string date, array of two string dates, or an object containing the year, month, day, or hour.`
      )
    }

    return true
  })
}

exports.phoneNumberValidator = (
  input = "phoneNumber",
  optional = false,
  isParam = false
) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .custom((phoneNumber) => {
      // all regex below are verified to be safe by
      // using npm package safe-regex
      const phoneNumberFormats = {
        parenthesis: /\([0-9]{3}\)[0-9]{3}-[0-9]{4}/,
        dashes: /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
        E164: /[0-9]{10}/,
      }

      for (const format in phoneNumberFormats) {
        const isPhoneNumber =
          phoneNumberFormats[String(format)].test(phoneNumber)

        if (isPhoneNumber) return true
      }

      throw new Error(
        `the given ${inputName} = ${phoneNumber} is not a proper phone number.`
      )
    })
    .customSanitizer((phoneNumber) => {
      if (!phoneNumber) return phoneNumber

      return phoneNumber.replace(/\D/g, "")
    })
}

exports.emailValidator = (
  input = "email",
  optional = false,
  isParam = false
) => {
  const { head, inputName } = basicValidator(input, optional, isParam)

  return head
    .normalizeEmail()
    .isEmail()
    .withMessage(inputName + " must be in email format.")
}

exports.validationPerusal = (req) => {
  const validationError = validationResult(req).array({
    onlyFirstError: true,
  })[0]

  if (validationError) {
    throw new Api400Error(
      req.session.merchant.preMsg + " " + validationError.msg,
      "Bad input request."
    )
  }
}

exports.credentialsValidator = () => {
  return [usernameValidator(), passwordValidator()]
}

exports.newCredentialsValidator = () => {
  return [
    usernameValidator("newUsername", true),
    passwordValidator("newPassword", true),
  ]
}
