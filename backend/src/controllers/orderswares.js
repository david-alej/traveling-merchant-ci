const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findOrdersWareQuery, parseOrdersWareInputs } =
  require("../services/index").orderswaresServices

exports.paramOrderId = async (req, res, next, orderId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("orderId", false, true).run(req)

    validationPerusal(req)

    const orderSearched = await models.Orders.findOne({
      where: { id: orderId },
    })

    if (!orderSearched) {
      throw new Api404Error(
        merchant.preMsg + ` order does not exist with order id = ${orderId}.`,
        "Order not found."
      )
    }

    req.orderId = orderId

    next()
  } catch (err) {
    next(err)
  }
}

exports.paramWareId = async (req, res, next, wareId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("wareId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.OrdersWares.findOne({
      where: {
        orderId: req.orderId,
        wareId,
      },
      ...findOrdersWareQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg +
          ` target ordersware with order id of ${req.orderId} and ware id of ${wareId} not found.`,
        "OrdersWare not found."
      )
    }

    req.targetOrdersWare = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getOrdersWare = async (req, res) => res.json(req.targetOrdersWare)

exports.getOrdersWares = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseOrdersWareInputs(req)

    const searched = await models.OrdersWares.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " orderswares were not found" + afterMsg,
        "OrdersWares not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject: newOrdersWare } = await parseOrdersWareInputs(req)

    const created = await models.OrdersWares.create(newOrdersWare)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create ordersware query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " ordersware has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const { orderId, wareId } = req.targetOrdersWare

  try {
    const { afterMsg, inputsObject: newValues } = await parseOrdersWareInputs(
      req
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.OrdersWares.update(newValues, {
      where: {
        orderId,
        wareId,
      },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update ordersware query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` ordersware with order id of ${orderId} and ware id of ${wareId} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteOrdersWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const { orderId, wareId } = req.targetOrdersWare

  try {
    const deleted = await models.OrdersWares.destroy({
      where: {
        orderId,
        wareId,
      },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete ordersware query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a ordersware with order id of ${orderId} and ware id of ${wareId}.`
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteOrdersWares = async (req, res, next) => {
  const merchant = req.session.merchant
  const orderId = req.orderId

  try {
    const deleted = await models.OrdersWares.destroy({ where: { orderId } })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete ordersware query did not work with order id = ${orderId}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted all orderswares with order id = ${orderId}.`
    )
  } catch (err) {
    next(err)
  }
}
