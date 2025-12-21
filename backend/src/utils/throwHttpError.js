/**
 * Cria um objeto Error com um status HTTP personalizado. Também lança o erro.
 * @param {number} status - O código de status HTTP a ser retornado.
 * @param {string} message - A mensagem de erro.
 * @param {string} code - Código para o sistema (ex: 'USER_NOT_FOUND').
 */
const throwHttpError = (status, message, code = 'INTERNAL_SERVER_ERROR') => {
  const error = new Error(message)

  error.status = status
  error.code = code

  throw error
}

export default throwHttpError
