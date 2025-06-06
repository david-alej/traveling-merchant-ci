const {
  validationPerusal,
  positiveIntegerValidator,
  phoneNumberValidator,
  wordValidator,
} = require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findClientQuery, parseClientInputs } =
  require("../services/index").clientsServices

exports.paramClientId = async (req, res, next, clientId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("clientId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Clients.findOne({
      where: { id: clientId },
      ...findClientQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target client ${clientId} not found.`,
        "Client not found."
      )
    }

    const client = searched.dataValues

    client.tickets.forEach((ticket) => {
      ticket = ticket.dataValues

      ticket.returned = Math.round(ticket.returned * 100) / 100

      ticket.paid = Math.round(ticket.paid * 100) / 100

      ticket.owed =
        Math.round((ticket.cost - ticket.returned - ticket.paid) * 100) / 100
    })

    req.targetClient = client

    next()
  } catch (err) {
    next(err)
  }
}

exports.getClient = async (req, res) => res.json(req.targetClient)

exports.getClients = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseClientInputs(req)

    const searched = await models.Clients.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " clients were not found" + afterMsg,
        "Clients not found."
      )
    }

    const clients = searched.map((client) => {
      client = client.dataValues

      client.tickets.forEach((ticket) => {
        ticket = ticket.dataValues

        ticket.returned = Math.round(ticket.returned * 100) / 100

        ticket.paid = Math.round(ticket.paid * 100) / 100

        ticket.owed =
          Math.round((ticket.cost - ticket.returned - ticket.paid) * 100) / 100
      })

      return client
    })

    res.json(clients)
  } catch (err) {
    next(err)
  }
}

exports.workValidation = async (req, res, next) => {
  const { workId, work } = req.body
  const merchant = req.session.merchant

  try {
    if (workId && work) {
      throw new Api400Error(
        merchant.preMsg + " cannot input workId and work at the same time."
      )
    }
  } catch (err) {
    next(err)
  }

  if (workId) {
    await positiveIntegerValidator("workId").run(req)
  } else {
    const workValidators = [
      wordValidator("work.name"),
      wordValidator("work.address"),
      phoneNumberValidator("work.phoneNumber"),
    ]

    for (const validator of workValidators) {
      await validator.run(req)
    }
  }

  next()
}

exports.postClient = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject } = await parseClientInputs(req, {})

    let newClient = inputsObject

    if (inputsObject.work) {
      const newWorkCreated = await models.Works.create(inputsObject.work)

      if (!newWorkCreated) {
        throw new Api500Error(
          merchant.preMsg + " create work query did not work.",
          "Internal server query error."
        )
      }

      newClient.workId = newWorkCreated.dataValues.id

      delete newClient.work
    }

    const created = await models.Clients.create(newClient)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create client query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " client has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putClient = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetClient = req.targetClient

  try {
    const { afterMsg, inputsObject: newValues } = await parseClientInputs(
      req,
      {}
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Clients.update(newValues, {
      where: { id: targetClient.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update client query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` client with id = ${targetClient.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteClient = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetClient = req.targetClient

  try {
    const deleted = await models.Clients.destroy({
      where: { id: targetClient.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete client query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a client with id = ${targetClient.id} and fullname = ${targetClient.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
