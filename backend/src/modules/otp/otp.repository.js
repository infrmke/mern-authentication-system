import Otp from './otp.model.js'

const createOtp = async (options) => await Otp.create(options)

const findOtpById = async (id, type) =>
  await Otp.findOne({ user: id, type, expiresAt: { $gt: Date.now() } })

const deleteOtp = async (id, type) => await Otp.deleteOne({ user: id, type })

export default { createOtp, findOtpById, deleteOtp }
