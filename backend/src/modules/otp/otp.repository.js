import Otp from './otp.model.js'

const create = async (options) => await Otp.create(options)

const findById = async (id, type) =>
  await Otp.findOne({ user: id, type, expiresAt: { $gt: Date.now() } })

const remove = async (id, type) => await Otp.deleteOne({ user: id, type })

export default { create, findById, remove }
