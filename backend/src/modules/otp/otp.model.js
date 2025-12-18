import mongoose, { Schema } from 'mongoose'

const otpSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['VERIFY', 'RESET'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// adiciona um "Time-To-Live" que configura o MongoDB pra deletar automaticamente o documento
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// índice composto para previnir mais de um OTP ativo do mesmo TIPO (verify ou reset)
otpSchema.index({ user: 1, type: 1 }, { unique: true })

const Otp = mongoose.model('Otp', otpSchema)

export default Otp
