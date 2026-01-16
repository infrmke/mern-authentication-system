import User from '../user/user.model.js'

const findAll = async (limit, offset) => {
  const [users, totalItems] = await Promise.all([
    User.find().skip(offset).limit(limit),
    User.countDocuments(),
  ])

  return { users, totalItems }
}

const findOne = async (filter, projection = undefined) => await User.findOne(filter, projection)

const findById = async (id) => await User.findById(id)

const create = async (data) => await User.create(data)

const updateById = async (id, data) => await User.findByIdAndUpdate(id, data, { new: true })

const deleteById = async (id) => await User.findByIdAndDelete(id)

export default { findAll, findOne, findById, create, updateById, deleteById }
