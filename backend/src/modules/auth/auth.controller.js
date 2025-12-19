import AuthService from './auth.service.js'

const status = async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      return res.status(401).end()
    }

    return res.status(200).json(req.user)
  } catch (error) {
    next(error)
  }
}

const logIn = async (req, res, next) => {
  if (req.cookies.accessToken) {
    return res.status(400).json({ error: 'Already logged in.' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      error: 'Must provide fields "email" and "password" to log in.',
    })
  }

  try {
    const capsule = await AuthService.logUserIn(password, { email })

    if (!capsule) {
      return res.status(400).json({ error: 'Incorrect credentials.' })
    }

    const { formattedUser, accessToken } = capsule

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    return res.status(200).json(formattedUser)
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    next(error)
  }
}

const logOut = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(400).json({ error: 'Already logged out.' })
  }

  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(200).json({ message: 'User has logged out.' })
  } catch (error) {
    next(error)
  }
}

export default {
  status,
  logIn,
  logOut,
}
