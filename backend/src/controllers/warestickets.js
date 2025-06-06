const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findWaresTicketQuery, parseWaresTicketInputs } =
  require("../services/index").waresticketsServices

exports.paramTicketId = async (req, res, next, ticketId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("ticketId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Tickets.findOne({
      where: { id: ticketId },
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg +
          ` target waresticket with ticket id = ${ticketId} not found.`,
        "Ticket not found."
      )
    }

    req.ticketId = ticketId

    next()
  } catch (err) {
    next(err)
  }
}

exports.paramWareId = async (req, res, next, wareId) => {
  const merchant = req.session.merchant
  const ticketId = req.ticketId

  try {
    await positiveIntegerValidator("wareId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.WaresTickets.findOne({
      where: { ticketId, wareId },
      ...findWaresTicketQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg +
          ` target waresticket with ticket id = ${ticketId} and ware id = ${wareId} not found.`,
        "WaresTicket not found."
      )
    }

    const waresTicket = searched.dataValues

    const ticket = waresTicket.ticket.dataValues

    ticket.returned = Math.round(ticket.returned * 100) / 100

    ticket.paid = Math.round(ticket.paid * 100) / 100

    ticket.owed =
      Math.round((ticket.cost - ticket.paid - ticket.returned) * 100) / 100

    req.targetWaresTicket = waresTicket

    next()
  } catch (err) {
    next(err)
  }
}

exports.getWaresTicket = async (req, res) => res.json(req.targetWaresTicket)

exports.getWaresTickets = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseWaresTicketInputs(req)

    const searched = await models.WaresTickets.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " warestickets were not found" + afterMsg,
        "WaresTickets not found."
      )
    }

    searched.forEach((waresTicket) => {
      waresTicket = waresTicket.dataValues

      const ticket = waresTicket.ticket.dataValues

      ticket.returned = Math.round(ticket.returned * 100) / 100

      ticket.paid = Math.round(ticket.paid * 100) / 100

      ticket.owed =
        Math.round((ticket.cost - ticket.paid - ticket.returned) * 100) / 100

      return waresTicket
    })

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newWaresTicket } =
      await parseWaresTicketInputs(req)

    const created = await models.WaresTickets.create(newWaresTicket)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create waresticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " waresticket has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const { wareId, ticketId } = req.targetWaresTicket

  try {
    const { afterMsg, inputsObject: newValues } = await parseWaresTicketInputs(
      req
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.WaresTickets.update(newValues, {
      where: { wareId, ticketId },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update waresticket query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` waresticket with ticket id = ${ticketId} and ware id = ${wareId} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWaresTicket = async (req, res, next) => {
  const merchant = req.session.merchant
  const { wareId, ticketId } = req.targetWaresTicket

  try {
    const deleted = await models.WaresTickets.destroy({
      where: { wareId, ticketId },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete waresticket query did not work with ticket id = ${ticketId} and ware id = ${wareId}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a waresticket with ticket id = ${ticketId} and ware id = ${wareId}.`
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWaresTickets = async (req, res, next) => {
  const merchant = req.session.merchant
  const ticketId = req.ticketId

  try {
    const deleted = await models.WaresTickets.destroy({
      where: { ticketId },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete waresticket query did not work with ticket id = ${ticketId}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a waresticket with ticket id = ${ticketId}.`
    )
  } catch (err) {
    next(err)
  }
}
