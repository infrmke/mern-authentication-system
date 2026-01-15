import { useRouteError, Link } from 'react-router-dom'
import useTitle from '../hooks/useTitle'

const ErrorPage = () => {
  useTitle('Oops!')
  const error = useRouteError()

  return (
    <div className="error fade-in" role="alert">
      <h1>Oops!</h1>
      <p>Looks like something went wrong.</p>

      <p aria-live="polite">
        <code>{error.statusText || 'Unknown Error'}</code>
      </p>

      <Link to="/" aria-label="Go back to previous page">
        Go back
      </Link>
    </div>
  )
}

export default ErrorPage
