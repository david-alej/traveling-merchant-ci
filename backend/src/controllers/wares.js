const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findWareQuery, parseWareInputs } =
  require("../services/index").waresServices

exports.paramWareId = async (req, res, next, wareId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("wareId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Wares.findOne({
      where: { id: wareId },
      ...findWareQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target ware ${wareId} not found.`,
        "Ware not found."
      )
    }

    req.targetWare = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getWare = async (req, res) => res.json(req.targetWare)

exports.getWares = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const {
      afterMsg,
      query,
      inputsObject: { stock },
    } = await parseWareInputs(req)

    if (stock) delete query.where.stock

    const searched = await models.Wares.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " wares were not found" + afterMsg,
        "Wares not found."
      )
    }

    let wares = searched

    if (stock) {
      wares = []

      searched.forEach((wareSearched) => {
        const ware = wareSearched.dataValues

        if (ware.stock === stock) wares.push(ware)
      })
    }

    res.json(wares)
  } catch (err) {
    next(err)
  }
}

exports.postWare = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, inputsObject: newWare } = await parseWareInputs(req, true)

    const created = await models.Wares.create(newWare)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create ware query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " ware has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWare = req.targetWare

  try {
    const { afterMsg, inputsObject: newValues } = await parseWareInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Wares.update(newValues, {
      where: { id: targetWare.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update ware query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` ware with id = ${targetWare.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWare = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWare = req.targetWare

  try {
    const deleted = await models.Wares.destroy({
      where: { id: targetWare.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg +
          ` delete ware query did not work with ware id = ${targetWare.id}.`,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a ware with id = ${targetWare.id} and fullname = ${targetWare.fullname}.`
    )
  } catch (err) {
    next(err)
  }
}
