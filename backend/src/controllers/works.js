const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findWorkQuery, parseWorkInputs } =
  require("../services/index").workServices
const { matchedData } = require("express-validator")

exports.paramWorkId = async (req, res, next, workId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("workId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Works.findOne({
      where: { id: workId },
      ...findWorkQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target work with id = ${workId} was not found`,
        "Work not found."
      )
    }

    req.targetWork = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getWork = (req, res) => res.send(req.targetWork)

exports.getWorks = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    validationPerusal(req)

    const { afterMsg, query } = await parseWorkInputs(req)

    const searched = await models.Works.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " works were not found" + afterMsg,
        "Works not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postWork = async (req, res, next) => {
  const merchant = req.session.merchant
  const requiredInputs = ["name", "address", "phoneNumber"]

  try {
    validationPerusal(req)

    const { afterMsg, inputsObject: newWork } = await parseWorkInputs(
      req,
      requiredInputs,
      true
    )

    const { phoneNumber } = matchedData(req)

    if (phoneNumber) newWork.phoneNumber = phoneNumber

    const created = await models.Works.create(newWork)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create work query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " work has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putWork = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWork = req.targetWork

  try {
    validationPerusal(req)

    const { afterMsg, inputsObject: newValues } = await parseWorkInputs(req)

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Works.update(newValues, {
      where: { id: targetWork.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update work query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` work with id = ${targetWork.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteWork = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetWork = req.targetWork

  try {
    const deleted = await models.Works.destroy({
      where: { id: targetWork.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete work query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a work with id = ${targetWork.id} and name = ${targetWork.name}.`
    )
    res.send()
  } catch (err) {
    next(err)
  }
}
