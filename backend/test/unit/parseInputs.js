/* eslint-disable no-useless-escape */

const { searchDateValidator } = require("../../src/util/validators")
const { expect } = require("../common")

const { parseInputs } = require("../../src/util/index").parseInputs
const {
  positiveIntegerValidator,
  floatValidator,
  arrayTextValidator,
  arrayObjectValidator,
  booleanValidator,
  wordValidator,
  dateValidator,
} = require("../../src/util/index").validators
const { Api400Error } = require("../../src/util/index").apiErrors

const { Op } = require("sequelize")

describe("Parsing Inputs", function () {
  let req
  const otherOptions = {
    include: [{ model: "ModelsTwo", as: "modelTwo" }],
    order: [["id", "DESC"]],
  }

  beforeEach(function () {
    // used to clear validationResults
    req = { session: { merchant: { preMsg: "" } }, body: {} }
  })

  const errorIt = async (
    key,
    value,
    validator,
    dataType,
    descriptionMsg = null
  ) => {
    const pascalCase = key.charAt(0).toUpperCase() + key.slice(1)
    req.body = { [String(key)]: value }
    const description =
      descriptionMsg || ` ${pascalCase} must be an ${dataType} number.`

    await validator(key).run(req)

    try {
      await parseInputs(req, otherOptions, "ModelOne")
    } catch (err) {
      expect(err).to.be.an.instanceOf(Api400Error)
      expect(err).to.include({
        description,
        message: "Bad input request.",
      })
    }
  }

  const numbersParsingIt = async (key, value, validator) => {
    req.body = { [String(key)]: value }
    const expectedQuery = { where: req.body, ...otherOptions, limit: 1000 }

    await validator(key).run(req)

    const { afterMsg, inputsObject, query } = await parseInputs(
      req,
      otherOptions,
      "ModelOne"
    )

    expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
    expect(inputsObject).to.eql(req.body)
    expect(query).to.eql(expectedQuery)
  }

  describe("Integers", function () {
    it("When input is not an integer, Then error is thrown", async function () {
      await errorIt("int", "string", positiveIntegerValidator, "integer")
    })

    it("When input is an integer, Then response is an object with properties that include input", async function () {
      await numbersParsingIt(
        "int",
        Math.ceil(Math.random() * 10),
        positiveIntegerValidator
      )
    })
  })

  describe("Floats", function () {
    it("When input is not an float, Then error is thrown", async function () {
      await errorIt("int", {}, floatValidator, "float")
    })

    it("When input is an float, Then response is an object with properties that include input", async function () {
      await numbersParsingIt("float", Math.random() * 10, floatValidator)
    })
  })

  describe("Arrays with Text Elements", function () {
    it("When input is not an array with all text elements, Then error is thrown", async function () {
      await errorIt(
        "arr",
        {},
        arrayTextValidator,
        null,
        " Arr array must have at least one element and less than 11 elements."
      )
    })

    it("When input is an array with text elements, Then response is an object with properties that include input", async function () {
      const [key, value] = ["arr", ["hi"]]
      req.body = { [String(key)]: value }
      const expectedQuery = {
        where: { [String(key)]: { [Op.contains]: value } },
        ...otherOptions,
        limit: 1000,
      }

      await arrayTextValidator(key).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions,
        "ModelOne"
      )

      expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })
  })

  describe("Array with Object Elements", function () {
    it("When input is not an array with all object elements, Then error is thrown", async function () {
      await errorIt(
        "arr",
        {},
        arrayObjectValidator,
        null,
        " Arr array must have at least one element and less than 50 elements."
      )
    })

    it("When input is an array with object elements, Then response is an object with properties that include input", async function () {
      const [key, value] = ["arr", [{}, {}]]
      req.body = { [String(key)]: value }
      const expectedQuery = {
        where: { [String(key)]: { [Op.contains]: value } },
        ...otherOptions,
        limit: 1000,
      }

      await arrayObjectValidator(key).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions,
        "ModelOne"
      )

      expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })
  })

  describe("Booleans", function () {
    it("When inputs is not true or false, Then error is thrown", async function () {
      await errorIt(
        "bool",
        "false",
        booleanValidator,
        null,
        "  must be either true or false."
      )
    })

    it("When input is a boolean, Then response is an object with properties that include input", async function () {
      const [key, value] = ["bool", false]
      req.body = { [String(key)]: value }
      const expectedQuery = { where: {}, ...otherOptions, limit: 1000 }

      await booleanValidator(key).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions,
        "ModelOne"
      )

      expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })
  })

  describe("Strings", function () {
    it("When inputs is not a string, Then error is thrown", async function () {
      await errorIt(
        "str",
        ["string"],
        wordValidator,
        null,
        " Str must be a string."
      )
    })

    it("When input is a string, Then response is an object with properties that include input", async function () {
      const [key, value] = ["str", "string"]
      req.body = { [String(key)]: value }
      const expectedQuery = { where: {}, ...otherOptions, limit: 1000 }
      expectedQuery.where[String(key)] = { [Op.iLike]: "%" + value + "%" }

      await wordValidator(key).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions,
        "ModelOne"
      )

      expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })
  })

  describe("Dates", function () {
    it("When input is not a Date, Then error is thrown", async function () {
      await errorIt(
        "dateAt",
        {},
        dateValidator,
        null,
        ` the given Date at = ${{}} is not a date.`
      )
    })

    it("When input is a Date, Then response is an object with properties that include input", async function () {
      const [key, value] = ["dateAt", "2023-03-21T09:00:00.000Z"]
      req.body = { [String(key)]: value }
      const expectedQuery = {
        where: {
          dateAt: value,
        },
        ...otherOptions,
        limit: 1000,
      }

      await searchDateValidator(key).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions,
        "ModelOne"
      )

      expect(afterMsg).to.equal(` with given ${key} = ${value}.`)
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })

    it("When input is a Date but a date was already given earlier, Then response is an object with properties that includes both date inputs", async function () {
      const [key, value] = ["dateAt", new Date().toISOString()]
      const [keyOne, valueOne] = ["dateOneAt", new Date().toISOString()]
      req.body = { [String(key)]: value, [String(keyOne)]: valueOne }
      const expectedQuery = {
        where: req.body,
        ...otherOptions,
        limit: 1000,
      }

      await dateValidator(key).run(req)
      await dateValidator(keyOne).run(req)

      const { afterMsg, inputsObject, query } = await parseInputs(
        req,
        otherOptions
      )

      expect(afterMsg).to.equal(
        ` with given ${key} = ${value}, and ${keyOne} = ${valueOne}.`
      )
      expect(inputsObject).to.eql(req.body)
      expect(query).to.eql(expectedQuery)
    })
  })
})
