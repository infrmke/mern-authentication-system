import jwt from 'jsonwebtoken'

const isEnvDev =
  process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'

/**
 * Verifica a integridade de um web token json lendo-o do cookie httpOnly de acordo com o ambiente.
 */
const verifyAccessToken = (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    return res.status(401).json({
      message: isEnvDev ? 'Access denied. Missing token.' : 'Access denied.',
    })
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    req.user = { ...req.user, ...payload }
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        message: isEnvDev ? 'Access denied. Expired token.' : 'Access denied.',
      })
    }

    next(error)
  }
}

export default verifyAccessToken
