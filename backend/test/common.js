/* eslint-disable node/no-unpublished-require */
const { initializeWebServer, stopWebServer } = require("../src/index")
const httpStatusCodes = require("../src/util/httpStatusCodes")
const models = require("../src/database/models")

const { wrapper } = require("axios-cookiejar-support")
const { CookieJar } = require("tough-cookie")
const { faker } = require("@faker-js/faker")
const httpMocks = require("node-mocks-http")
const axios = require("axios")
const sinon = require("sinon")
const fs = require("node:fs")
const chai = require("chai")
require("dotenv").config()

const expect = chai.expect

chai.use(require("chai-json-schema"))
chai.use(require("chai-datetime"))

const fakerUsername = () => {
  const minLength = 4
  const maxLength = 20
  let username = faker.internet.userName()

  while (username.length < minLength || username.length > maxLength) {
    username = faker.internet.userName()
  }

  return username
}

const fakerPassword = () => {
  const minLength = 8
  const maxLength = 20
  const uppercaseRegex = /[A-Z]/
  const numberRegex = /\d/

  let password = faker.internet.password()

  while (
    password.length < minLength ||
    password.length > maxLength ||
    !uppercaseRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    password = faker.internet.password()
  }

  return password
}

const fakerPhoneNumber = () => {
  // all regex below are verified to be safe by
  // using npm package safe-regex
  const phoneNumberFormats = [
    /([0-9]{3})[0-9]{3}-[0-9]{4}/,
    /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
    /[0-9]{3}[0-9]{3}[0-9]{4}/,
  ]

  const phoneNumber = faker.helpers.fromRegExp(
    phoneNumberFormats[Math.floor(Math.random() * 3)]
  )
  return phoneNumber
}

const round = (number) => {
  return Math.round(number * 100) / 100
}

const merchantCredentials = {
  username: "missioneros",
  password: "nissiJire2",
}

const axiosConfig = {
  baseURL: "http://localhost:",
  validateStatus: () => true,
  withCredentials: true,
}

let client = null

const startClient = async () => {
  const jar = new CookieJar()
  let port = process.env.PORT || 3000
  let host = process.env.CI_BACKEND || "localhost"

  client = wrapper(
    axios.create({
      baseURL: `http://${host}:${port}`,
      validateStatus: () => true,
      withCredentials: true,
      jar,
    })
  )

  let csrfToken = null

  client.interceptors.request.use((config) => {
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken
    }
    return config
  })

  client.interceptors.response.use((response) => {
    const { config, data } = response

    if (
      config.url === "/login" &&
      config.method?.toLowerCase() === "post" &&
      data?.csrfToken
    ) {
      csrfToken = data.csrfToken
    }

    return response
  })

  return client
}

const initializeClient = async () => {
  if (!client) {
    client = await startClient()
  }

  const { status } = await client.post("/login", merchantCredentials)

  return { axiosClient: client, status }
}

module.exports = {
  axios,
  axiosConfig,
  initializeWebServer,
  startClient,
  initializeClient,
  stopWebServer,
  expect,
  faker,
  fs,
  fakerUsername,
  fakerPassword,
  fakerPhoneNumber,
  httpMocks,
  httpStatusCodes,
  preMerchantMsg: "Merchant: 1",
  sinon,
  merchantCredentials,
  models,
  round,
}
