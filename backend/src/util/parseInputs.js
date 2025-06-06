/* eslint-disable no-useless-escape */

const { Op } = require("sequelize")
const { matchedData } = require("express-validator")
// const models = require("../database/models")
const { validationPerusal } = require("./validators")

// How to use postgres extract function in sequelize to get date
// Sequelize.fn(
//   `EXTRACT(YEAR from \"${tableName}\".\"${inputName}\") =`,
//   year
// )

const createDateQuery = (inputName, input, whereOptions) => {
  const dataType = typeof input

  if (typeof whereOptions[String(inputName)] !== "object") {
    whereOptions[String(inputName)] = {}
  }

  if (dataType === "string") {
    input = new Date(input).toISOString()

    whereOptions[String(inputName)] = input
  } else if (Array.isArray("array")) {
    whereOptions[String(inputName)] = { [Op.between]: input }
  } else if (dataType === "object" && input !== null) {
    const { year, month, day, hour } = input
    const unformattedTimes = [year, month, day, hour]
    const times = []

    for (let i = 0; i < unformattedTimes.length; i++) {
      const time = unformattedTimes[parseInt(i)]

      if (
        !Number.isInteger(time) ||
        (i === 0
          ? String(time).length !== 4
          : String(time).length !== 2 && String(time).length !== 1)
      ) {
        break
      }

      times.push(time)
    }

    const startDate = new Date(...times.map((time) => time), 0)

    const lastTime = times.pop()
    times.push(lastTime + 1)

    const endDate = new Date(...times.map((time) => time), 0)

    const extrema = [startDate.toISOString(), endDate.toISOString()]

    whereOptions[String(inputName)] = { [Op.between]: extrema }
  }
}

const createStringQuery = (inputName, input, whereOptions) => {
  whereOptions[String(inputName)] = {
    [Op.iLike]: "%" + input + "%",
  }
}

const createSubsetObject = (obj, keys) => {
  return Object.fromEntries(
    keys
      .filter((key) => typeof obj[String(key)] !== "undefined")
      .map((key) => [key, obj[String(key)]])
  )
}

module.exports = {
  createSubsetObject,
  parseInputs: async (req, otherOptions) => {
    validationPerusal(req)

    const inputsObject = matchedData(req, { locations: ["body"] })

    if (JSON.stringify(inputsObject) === "{}") {
      return {
        query: otherOptions,
        afterMsg: ".",
        inputsObject: {},
      }
    }

    const numberOfInputs = Object.keys(inputsObject).length

    let afterMsg = " with given "

    let numberOfInputsLeft = numberOfInputs

    let whereOptions = {}

    for (let inputName in inputsObject) {
      const input = inputsObject[String(inputName)]

      const lastTwoChar = inputName.slice(-2)
      numberOfInputsLeft--

      if (numberOfInputs === 1) {
        afterMsg += `${inputName} = ${input}.`
      } else if (numberOfInputsLeft === 0) {
        afterMsg += `and ${inputName} = ${input}.`
      } else {
        afterMsg += `${inputName} = ${input}, `
      }

      if (typeof input === "boolean") continue

      if (lastTwoChar === "At") {
        createDateQuery(inputName, input, whereOptions)
      } else if (typeof input === "number") {
        whereOptions[String(inputName)] = input
      } else if (Array.isArray(input)) {
        whereOptions[String(inputName)] = { [Op.contains]: input }
      } else {
        createStringQuery(inputName, input, whereOptions)
      }
    }

    return {
      query: {
        where: whereOptions,
        ...otherOptions,
        limit: 1000,
      },
      afterMsg,
      inputsObject,
    }
  },
}
