import { useEffect } from 'react'

/**
 * Altera o título do documento.
 * @param {string} title - Título da página.
 */
const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = `${title} | Authentication System`

    return () => (document.title = prevTitle)
  }, [title])
}

export default useTitle
