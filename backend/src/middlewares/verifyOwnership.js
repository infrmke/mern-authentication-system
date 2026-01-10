/**
 * Verifica se o usuário autenticado é o proprietário da conta passada pelo ID na URL.
 */
const verifyOwnership = (req, res, next) => {
  if (req.params.id !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ message: 'You can only modify your own account.' })
  }
  next()
}

export default verifyOwnership
