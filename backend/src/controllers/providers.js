const { validationPerusal, positiveIntegerValidator } =
  require("../util/index").validators
const models = require("../database/models")
const { Api400Error, Api404Error, Api500Error } =
  require("../util/index").apiErrors
const { findProviderQuery, parseProviderInputs } =
  require("../services/index").providersServices

exports.paramProviderId = async (req, res, next, providerId) => {
  const merchant = req.session.merchant

  try {
    await positiveIntegerValidator("providerId", false, true).run(req)

    validationPerusal(req)

    const searched = await models.Providers.findOne({
      where: { id: providerId },
      ...findProviderQuery,
    })

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + ` target provider ${providerId} not found.`,
        "Provider not found."
      )
    }

    req.targetProvider = searched.dataValues

    next()
  } catch (err) {
    next(err)
  }
}

exports.getProvider = async (req, res) => res.json(req.targetProvider)

exports.getProviders = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { afterMsg, query } = await parseProviderInputs(req)

    const searched = await models.Providers.findAll(query)

    if (!searched) {
      throw new Api404Error(
        merchant.preMsg + " providers were not found" + afterMsg,
        "Providers not found."
      )
    }

    res.json(searched)
  } catch (err) {
    next(err)
  }
}

exports.postProvider = async (req, res, next) => {
  const merchant = req.session.merchant

  try {
    const { inputsObject: newProvider } = await parseProviderInputs(req)

    const created = await models.Providers.create(newProvider)

    if (!created) {
      throw new Api500Error(
        merchant.preMsg + " create provider query did not work.",
        "Internal server query error."
      )
    }

    res.status(201).send(merchant.preMsg + " provider has been created.")
  } catch (err) {
    next(err)
  }
}

exports.putProvider = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetProvider = req.targetProvider

  try {
    const { afterMsg, inputsObject: newValues } = await parseProviderInputs(
      req,
      true
    )

    if (JSON.stringify(newValues) === "{}") {
      throw new Api400Error(
        merchant.preMsg + " did not update any value.",
        "Bad input request."
      )
    }

    const updated = await models.Providers.update(newValues, {
      where: { id: targetProvider.id },
    })

    if (!updated) {
      throw new Api500Error(
        merchant.preMsg + " update provider query did not work" + afterMsg,
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` provider with id = ${targetProvider.id} was updated` +
        afterMsg
    )
  } catch (err) {
    next(err)
  }
}

exports.deleteProvider = async (req, res, next) => {
  const merchant = req.session.merchant
  const targetProvider = req.targetProvider

  try {
    const deleted = await models.Providers.destroy({
      where: { id: targetProvider.id },
    })

    if (!deleted) {
      throw new Api500Error(
        merchant.preMsg + " delete provider query did not work.",
        "Internal server query error."
      )
    }

    res.send(
      merchant.preMsg +
        ` has deleted a provider with id = ${targetProvider.id} and name = ${targetProvider.name}.`
    )
  } catch (err) {
    next(err)
  }
}
