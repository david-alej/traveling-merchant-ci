const {
  validationPerusal,
  positiveIntegerValidator,
  nonNegativeIntegerValidator,
} = require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findWaresQuery, findTicketQuery, parseTicketInputs } =
  require("../services/index").ticketsServices

exports.paramTicketId = async (req, res, next, ticketId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("ticketId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Tickets.findOne({
      where: { id: ticketId },
      ...findTicketQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target ticket ${ticketId} not found.`,
        "Ticket not found."
      )
    }

    const ticket = searched.dataValues

    ticket.returned = Math.round(ticket.returned * 100) / 100

    ticket.paid = Math.round(ticket.paid * 100) / 100

    ticket.owed =
      Math.round((ticket.cost - ticket.returned - ticket.paid) * 100) / 100

    req.targetTicket = ticket

    next()
  } catch (err) {
    next(err)
  }
}

exports.getTicket = async (req, res) => res.json(req.targetTicket)

const round = (float) => Math.round(float * 100) / 100

exports.getTickets = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query, inputsObject } = await parseTicketInputs(req)

    const searched = await models.Tickets.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " tickets were not found" + afterMsg,
        "Tickets not found."
      )
    }

    for (let i = 0; i < searched.length; i++) {
      const ticket = searched[parseInt(i)].dataValues
      let { cost, returned, paid } = ticket
      ticket.returned = round(returned)
      ticket.paid = round(paid)

      const owed = round(cost - round(returned) - round(paid))

      if (inputsObject.pending && owed === 0) {
        searched.splice(i, 1)
        i--
      } else {
        ticket.owed = owed
      }
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postValidation = async (req, res, next) => {
  const { waresTickets } = req.body

  if (!Array.isArray(waresTickets)) return next()

  for (let i = 0; i < waresTickets.length; i++) {
    await positiveIntegerValidator(`waresTickets[${i}].wareId`).run(req)
    await positiveIntegerValidator(`waresTickets[${i}].amount`).run(req)
    await nonNegativeIntegerValidator(`waresTickets[${i}].returned`, true).run(
      req
    )
  }

  next()
}

const parseNewWaresTickets = async (waresTickets, merchantPreMsg) => {
  waresTickets.sort((a, b) => b.wareId - a.wareId)

  const wareIds = waresTickets.map((waresTicket) => {
    waresTicket.returned = waresTicket.returned || 0

    if (waresTicket.amount < waresTicket.returned) {
      throw new Api400Error(
        merchantPreMsg +
          ` has input more amount returned than was sold for ware id = ${waresTicket.wareId}.`,
        "Bad input request."
      )
    }

    return waresTicket.wareId
  })

  const duplicateWareIds = wareIds.filter(
    (item, index) => wareIds.indexOf(item) !== index
  )

  if (duplicateWareIds.length !== 0) {
    throw new Api400Error(
      merchantPreMsg +
        ` merchant has input the following duplicate ware ids, ${duplicateWareIds}, in the waresTickets array.`,
      "Bad input request."
    )
  }

  const waresSearched = await models.Wares.findAll(findWaresQuery(wareIds))

  let totalCost = 0

  waresTickets.forEach((waresTicket) => {
    const index = wareIds.indexOf(waresTicket.wareId)

    const ware = waresSearched[parseInt(index)].dataValues

    if (typeof ware !== "object" || ware.id !== waresTicket.wareId) {
      throw new Api404Error(
        merchantPreMsg +
          ` the wares with id = ${waresTicket.wareId} was not found.`,
        "Ware not found."
      )
    }

    totalCost += waresTicket.amount * ware.unitPrice

    const remainingStock =
      ware.stock - waresTicket.amount + waresTicket.returned

    if (remainingStock < 0 || waresTicket.amount > ware.stock) {
      throw new Api400Error(
        merchantPreMsg +
          ` merchant has input more amount of a ware than what is in stock with ware id = ${ware.id}.`,
        "Bad input request."
      )
    }
  })

  return totalCost
}

const createWaresTickets = async (ticketId, newWaresTickets, errorMsg) => {
  for (const newWaresTicket of newWaresTickets) {
    const waresTicketCreated = await models.WaresTickets.create({
      ticketId,
      ...newWaresTicket,
    })

    if (!waresTicketCreated) {
      await models.Tickets.destroy({
        where: { id: ticketId },
      })

      throw new Api500Error(errorMsg, "Internal server query error.")
    }
  }
}

exports.postTicket = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject } = await parseTicketInputs(req, {})

    const newWaresTickets = inputsObject.waresTickets
    delete inputsObject.waresTickets

    const newTicket = inputsObject

    const totalCost = await parseNewWaresTickets(
      newWaresTickets,
      merchant.preMsg
    )

    if (!newTicket.cost) newTicket.cost = totalCost

    const created = await models.Tickets.create(newTicket)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create ticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    const ticketId = created.dataValues.id

    await createWaresTickets(
      ticketId,
      newWaresTickets,
      merchant.preMsg +
        " create waresTickets query with tickets query did not work" +
        afterMsg
    )

    res.status(201).send(merchant.preMsg + " ticket has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTicket = req.targetTicket

  try {
    const { afterMsg, inputsObject: newValues } = await parseTicketInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Tickets.update(newValues, {
      where: { id: targetTicket.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update ticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` ticket with id = ${targetTicket.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTicket = req.targetTicket

  try {
    const deleted = await models.Tickets.destroy({
      where: { id: targetTicket.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete ticket query did not work with ticket id = ${targetTicket.id}`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a ticket with id = ${targetTicket.id} and fullname = ${targetTicket.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
