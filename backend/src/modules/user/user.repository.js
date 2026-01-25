import User from '../user/user.model.js'

class UserRepository {
  async findAll(limit, offset) {
    const [users, totalItems] = await Promise.all([
      User.find().skip(offset).limit(limit),
      User.countDocuments(),
    ])

    return { users, totalItems }
  }

  async findOne(filter, projection = {}) {
    return await User.findOne(filter, projection)
  }

  async findById(id) {
    return await User.findById(id)
  }

  async create(data) {
    return await User.create(data)
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id) {
    return await User.findByIdAndDelete(id)
  }
}

export default new UserRepository()
