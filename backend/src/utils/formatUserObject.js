const formatUserObject = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  isAccountVerified: user.isAccountVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export default formatUserObject
