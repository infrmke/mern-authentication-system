import mongoose, { Schema } from 'mongoose'
import { generatePassword } from '../../utils/password.js'

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid e-mail format.'],
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    isAccountVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

//  faz a senha ser hasheada na operação User.save()
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const hash = await generatePassword(this.password)
    this.password = hash
    next()
  } catch (error) {
    next(error)
  }
})

//  faz a senha ser hasheada nas operações User.findByIdAndUpdate() e User.findOneAndUpdate()
userSchema.pre('findOneAndUpdate', async function (next) {
  // pega o objeto do "update" ex.:{ password: 'nova_senha' })
  const update = this.getUpdate()

  // verifica se a senha está sendo atualizada no objeto
  if (update.password) {
    try {
      const hash = await generatePassword(update.password)
      update.password = hash
    } catch (error) {
      next(error)
    }
  }
  next()
})

const User = mongoose.model('User', userSchema)

export default User
