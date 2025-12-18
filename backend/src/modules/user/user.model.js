import mongoose, { Schema } from 'mongoose'

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

const User = mongoose.model('User', userSchema)

export default User
