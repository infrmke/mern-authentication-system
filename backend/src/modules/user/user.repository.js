import User from '../user/user.model.js'

const findAll = async () => await User.find()

const findOne = async (filter, projection = undefined) =>
  await User.findOne(filter, projection)

const findById = async (id) => await User.findById(id)

const create = async (data) => await User.create(data)

const updateById = async (id, data) =>
  await User.findByIdAndUpdate(id, data, { new: true })

export default { findAll, findOne, findById, create, updateById }
