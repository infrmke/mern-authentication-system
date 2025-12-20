/**
 * Gera uma string de 8 dígitos numéricos aleatórios para ser usada como OTP.
 * @returns {string}
 */
const generateOtp = () => {
  let otp = ''

  for (let i = 0; i < 6; i++) {
    const digit = Math.floor(Math.random() * 10)
    otp += digit
  }

  return otp
}

export default generateOtp
