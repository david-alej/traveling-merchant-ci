const {
  validationPerusal,
  positiveIntegerValidator,
  nonNegativeIntegerValidator,
  positiveFloatValidator,
  wordValidator,
  phoneNumberValidator,
  emailValidator,
} = require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findOrderQuery, parseOrderInputs, findWaresQuery } =
  require("../services/index").ordersServices

exports.paramOrderId = async (req, res, next, orderId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("orderId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Orders.findOne({
      where: { id: orderId },
      ...findOrderQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target order ${orderId} not found.`,
        "Order not found."
      )
    }

    req.targetOrder = searched

    next()
  } catch (err) {
    next(err)
  }
}

exports.getOrder = async (req, res) => res.json(req.targetOrder)

exports.getOrders = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseOrderInputs(req)

    if (req.body.pending) {
      query.where.actualAt = null
    }

    const searched = await models.Orders.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " orders were not found" + afterMsg,
        "Orders not found."
      )
    }

    searched.forEach((order) => {
      order = order.dataValues

      order.returned = Math.round(order.returned * 100) / 100

      order.paid = Math.round(order.paid * 100) / 100

      order.owed =
        Math.round((order.cost - order.returned - order.paid) * 100) / 100
    })

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postValidation = async (req, res, next) => {
  const { ordersWares, provider, providerId } = req.body
  const merchant = req.session.merchant

  if (!Array.isArray(ordersWares)) return next()

  try {
    if (provider && providerId) {
      throw new Api400Error(
        merchant.preMsg +
          " cannot input providerId and provider at the same time.",
        "Bad input request."
      )
    }
  } catch (err) {
    next(err)
  }

  for (let i = 0; i < ordersWares.length; i++) {
    await positiveIntegerValidator(`ordersWares[${i}].wareId`).run(req)
    await positiveIntegerValidator(`ordersWares[${i}].amount`).run(req)
    await positiveFloatValidator(`ordersWares[${i}].unitPrice`).run(req)
    await nonNegativeIntegerValidator(`ordersWares[${i}].returned`, true).run(
      req
    )
  }

  if (providerId) {
    await positiveIntegerValidator("providerId").run(req)
  } else {
    const providerValidators = [
      wordValidator("provider.name"),
      wordValidator("provider.address"),
      phoneNumberValidator("provider.phoneNumber"),
      emailValidator("provider.email", true),
    ]

    for (const validator of providerValidators) {
      await validator.run(req)
    }
  }

  next()
}

const parseNewOrdersWares = async (inputsObject, merchantPreMsg) => {
  const ordersWares = inputsObject.ordersWares

  ordersWares.sort((a, b) => b.wareId - a.wareId)

  const wareIds = ordersWares.map((ordersWare) => {
    ordersWare.returned = ordersWare.returned || 0

    if (ordersWare.amount < ordersWare.returned) {
      throw new Api400Error(
        merchantPreMsg +
          ` has input more amount returned than was bought for ware id = ${ordersWare.wareId}.`,
        "Bad input request."
      )
    }

    return ordersWare.wareId
  })

  const duplicateWareIds = wareIds.filter(
    (item, index) => wareIds.indexOf(item) !== index
  )

  if (duplicateWareIds.length !== 0) {
    throw new Api400Error(
      merchantPreMsg +
        ` has input the following duplicate ware ids, ${duplicateWareIds}, in the waresOrders array.`,
      "Bad input request."
    )
  }

  const waresSearched = await models.Wares.findAll(findWaresQuery(wareIds))

  ordersWares.forEach((ordersWare) => {
    const index = wareIds.indexOf(ordersWare.wareId)

    const ware = waresSearched[parseInt(index)].dataValues

    if (typeof ware !== "object" || ware.id !== ordersWare.wareId) {
      throw new Api404Error(
        merchantPreMsg + ` the ware with id = ${ware.id} was not found.`,
        "Ware not found."
      )
    }
  })

  delete inputsObject.ordersWares

  return ordersWares
}

const createOrdersWare = async (orderId, newOrdersWare, errorMsg) => {
  newOrdersWare.forEach((ordersWare) => (ordersWare.orderId = orderId))

  const ordersWaresCreated = await models.OrdersWares.bulkCreate(newOrdersWare)

  if (!ordersWaresCreated) {
    await models.Orders.destroy({
      where: { id: orderId },
    })

    throw new Api500Error(errorMsg, "Internal server query error.")
  }
}

const parseNewProvider = async (inputsObject, merchantPreMsg) => {
  if (!inputsObject.provider) return

  const newProviderCreated = await models.Providers.create(
    inputsObject.provider
  )

  if (!newProviderCreated) {
    throw new Api500Error(
      merchantPreMsg +
        " create provider query with order creation did not work.",
      "Internal server query error."
    )
  }

  inputsObject.providerId = newProviderCreated.dataValues.id

  delete inputsObject.provider
}

exports.postOrder = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject } = await parseOrderInputs(req, {})

    const [newOrdersWares] = await Promise.all([
      parseNewOrdersWares(inputsObject, merchant.preMsg),
      parseNewProvider(inputsObject, merchant.preMsg),
    ])

    const created = await models.Orders.create(inputsObject)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create order query did not work.",
        "Internal server query error."
      )
    }

    const orderId = created.dataValues.id

    await createOrdersWare(
      orderId,
      newOrdersWares,
      merchant.preMsg +
        " create ordersWares query with orders query did not work" +
        afterMsg
    )

    res.status(201).send(merchant.preMsg + " order has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putOrder = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrder = req.targetOrder

  try {
    const { afterMsg, inputsObject: newValues } = await parseOrderInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Orders.update(newValues, {
      where: { id: targetOrder.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update order query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` order with id = ${targetOrder.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteOrder = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetOrder = req.targetOrder

  try {
    const deleted = await models.Orders.destroy({
      where: { id: targetOrder.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete order query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg + ` has deleted a order with id = ${targetOrder.id}.`
    )
  } catch (err) {
    next(err)
  }
}
