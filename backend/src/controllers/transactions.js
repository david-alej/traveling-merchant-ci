/* eslint-disable indent */
const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findTransactionQuery, parseTransactionInputs } =
  require("../services/index").transactionsServices

exports.paramTransactionId = async (req, res, next, transactionId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("transactionId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Transactions.findOne({
      where: { id: transactionId },
      ...findTransactionQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target transaction ${transactionId} not found.`,
        "Transaction not found."
      )
    }

    const transaction = searched.dataValues

    if (transaction.ticket) {
      const ticket = transaction.ticket.dataValues

      ticket.returned = Math.round(ticket.returned * 100) / 100

      ticket.paid = Math.round(ticket.paid * 100) / 100

      ticket.owed =
        Math.round((ticket.cost - ticket.paid - ticket.returned) * 100) / 100
    }

    req.targetTransaction = transaction

    next()
  } catch (err) {
    next(err)
  }
}

exports.getTransaction = async (req, res) => res.json(req.targetTransaction)

exports.getTransactions = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseTransactionInputs(req)

    const searched = await models.Transactions.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " transactions were not found" + afterMsg,
        "Transactions not found."
      )
    }

    searched.forEach((transaction) => {
      transaction = transaction.dataValues

      if (transaction.ticket) {
        const ticket = transaction.ticket.dataValues

        ticket.returned = Math.round(ticket.returned * 100) / 100

        ticket.paid = Math.round(ticket.paid * 100) / 100

        ticket.owed =
          Math.round((ticket.cost - ticket.paid - ticket.returned) * 100) / 100
      }
    })

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.foreignKeyValidation =
  (isPost = true) =>
  async (req, res, next) => {
    const merchant = req.session.merchant
    const { orderId, ticketId } = req.body

    try {
      if (orderId && ticketId) {
        throw new Api400Error(
          merchant.preMsg +
            " cannot input orderId and ticketId at the same time.",
          "Bad input request."
        )
      }

      if (isPost && !orderId && !ticketId) {
        throw new Api400Error(
          merchant.preMsg + " has to input either orderId or ticketId.",
          "Bad input request."
        )
      }

      next()
    } catch (err) {
      next(err)
    }
  }

exports.postTransaction = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newTransaction } =
      await parseTransactionInputs(req, true)

    const created = await models.Transactions.create(newTransaction)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create transaction query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " transaction has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putTransaction = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTransaction = req.targetTransaction
  const { orderId } = req.body

  try {
    const { afterMsg, inputsObject: newValues } = await parseTransactionInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const nullForeignKey = orderId ? "ticketId" : "orderId"

    newValues[String(nullForeignKey)] = null

    const updated = await models.Transactions.update(newValues, {
      where: { id: targetTransaction.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update transaction query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` transaction with id = ${targetTransaction.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteTransaction = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetTransaction = req.targetTransaction

  try {
    const deleted = await models.Transactions.destroy({
      where: { id: targetTransaction.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete transaction query did not work with transaction id = ${targetTransaction.id}`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a transaction with id = ${targetTransaction.id} and fullname = ${targetTransaction.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
