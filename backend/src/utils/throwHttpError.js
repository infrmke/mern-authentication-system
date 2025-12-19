/**
 * Cria um objeto Error com um status HTTP personalizado. Também lança o erro.
 * @param {number} status - O código de status HTTP a ser retornado.
 * @param {string} message - A mensagem de erro.
 */
const throwHttpError = (status, message) => {
  const error = new Error(message)
  error.statusCode = status
  throw error
}

export default throwHttpError
