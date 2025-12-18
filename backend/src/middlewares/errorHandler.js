/**  Captura qualquer erro inesperado lançado em rotas, middlewares ou controllers.
 * Diferencia entre ambiente de produção e desenvolvimento.
 */
const errorHandler = (err, req, res, next) => {
  console.log(err)

  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler
